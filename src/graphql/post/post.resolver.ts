import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Document } from 'mongoose';
import { difference, differenceBy } from 'lodash';

import Post, { LimitPost, PostType } from './post.type';
import { AddPostInput, UpdatePostInput, PaginationInput } from './post.input';

// mongoose model
import PostModel from '../../schema/post.db';
import CategoriesModel from '../../schema/categories.db';
import TagsModel from '../../schema/tags.db';

export interface Posts {
    posts: Document[];
    pagination: {
        currentPage: number;
        pageSize: number;
        total: number;
    };
}

/* eslint-disable */
@Resolver()
class PostResolver {
    @Query(returns => [Post], { description: 'query published posts' })
    async posts(): Promise<Document[]> {
        return PostModel.find({ type: PostType.published });
    }

    @Query(returns => [Post], { description: 'query draft posts' })
    async draft(): Promise<Document[]> {
        return PostModel.find({ type: PostType.draft });
    }

    @Query(returns => [Post], { description: 'query trash posts' })
    async trash(): Promise<Document[]> {
        return PostModel.find({ type: PostType.draft });
    }

    @Query(returns => LimitPost, { description: 'query posts by pagination' })
    async limitPosts(
        @Arg('pagination') pagination: PaginationInput,
        @Arg('type', { defaultValue: PostType.published }) type: String,
    ): Promise<Posts> {
        const { currentPage, pageSize } = pagination;
        const posts = await PostModel.find({ type })
            .limit(pageSize)
            .skip((currentPage - 1) * pageSize);
        const total = await PostModel.countDocuments({ type });
        return { posts, pagination: { currentPage, pageSize, total } };
    }

    @Query(returns => Post, { description: 'query post by id' })
    async post(@Arg('id') id: string): Promise<Document> {
        return await PostModel.findById(id);
    }

    @Mutation(returns => Post, { description: 'add new post' })
    async addPost(@Arg('data') newPost: AddPostInput): Promise<Document> {
        const post = await PostModel.create({ ...newPost, postedTime: new Date(), updateTime: null, revisionCount: 0 });
        const { categories, tags, _id } = post;

        if (categories.length !== 0) {
            // push post id to saved categories
            await CategoriesModel.updateMany({ name: { $in: categories } }, { $push: { posts: _id } });
            // find unsaved categories and create it
            const savedCategories = await CategoriesModel.find({ name: { $in: categories } });
            const unSavedCategories = differenceBy(
                categories.map(name => ({ name })),
                savedCategories.map(({ name }) => ({ name })),
                'name',
            ).map(({ name }) => ({ name, posts: [_id] }));
            // saving categories
            if (unSavedCategories.length !== 0) await CategoriesModel.create(unSavedCategories);
        }
        if (tags.length !== 0) {
            // push post id to saved tags
            await TagsModel.updateMany({ name: { $in: tags } }, { $push: { posts: _id } });
            // find unsaved tags and create it
            const savedTags = await TagsModel.find({ name: { $in: tags } });
            const unSavedTags = differenceBy(
                tags.map(name => ({ name })),
                savedTags.map(({ name }) => ({ name })),
                'name',
            ).map(({ name }) => ({ name, posts: [_id] }));
            // saving tags
            if (unSavedTags.length !== 0) await TagsModel.create(unSavedTags);
        }

        return post;
    }

    @Mutation(returns => Post, { description: 'update post by id' })
    async updatePost(@Arg('id') id: string, @Arg('data') updatePost: UpdatePostInput) {
        const oldPost = await PostModel.findByIdAndUpdate(id, {
            ...updatePost,
            updateTime: new Date(),
            $inc: { revisionCount: 1 },
        });
        const { categories = [], tags = [] } = updatePost;
        const { categories: oldCategories, tags: oldTags } = oldPost;
        // update categories
        const removedCategories = difference(oldCategories, categories);
        const newCategories = difference(categories, oldCategories);
        // remove categories ref
        if (removedCategories.length !== 0)
            await CategoriesModel.updateMany({ name: { $in: removedCategories } }, { $pull: { posts: id } });
        // if has new categories
        if (newCategories.length !== 0) {
            // if categories name exist
            await CategoriesModel.updateMany({ name: { $in: newCategories } }, { $push: { posts: id } });
            // create unsaved categories
            const savedCategories = await CategoriesModel.find({ name: { $in: newCategories } });
            const unSavedCategories = difference(newCategories, savedCategories.map(({ name }) => name));
            if (unSavedCategories.length !== 0)
                await CategoriesModel.create(unSavedCategories.map(name => ({ name, posts: [id] })));
        }
        // update tags
        const removedTags = difference(oldTags, tags);
        const newTags = difference(tags, oldTags);
        // if tags name exist
        if (removedTags.length !== 0)
            await TagsModel.updateMany({ name: { $in: removedTags } }, { $pull: { posts: id } });
        // if has new tags
        if (newTags.length !== 0) {
            // if tags name exist
            await TagsModel.updateMany({ name: { $in: newTags } }, { $push: { posts: id } });
            // create unsaved tags
            const savedTags = await TagsModel.find({ name: { $in: newTags } });
            const unSavedTags = difference(newTags, savedTags.map(({ name }) => name));
            if (unSavedTags.length !== 0) await TagsModel.create(unSavedTags.map(name => ({ name, posts: [id] })));
        }
        return await PostModel.findById(id);
    }

    @Mutation(returns => Post, { description: 'delete post by id' })
    async deletePost(@Arg('id') id: string): Promise<Document> {
        const post = await PostModel.findByIdAndDelete(id);
        const { categories, tags, _id } = post;
        // pull the post id from categories
        await CategoriesModel.updateMany({ name: { $in: categories } }, { $pull: { posts: _id } });
        // pull the post id from tags
        await TagsModel.updateMany({ name: { $in: tags } }, { $pull: { posts: _id } });
        return post;
    }
}

export default PostResolver;
