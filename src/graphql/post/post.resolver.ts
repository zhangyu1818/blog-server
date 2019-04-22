import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Document } from 'mongoose';
import { differenceBy } from 'lodash';

import Post, { LimitPost } from './post.type';
import { AddPostInput, PaginationInput } from './post.input';

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
    @Query(returns => [Post], { description: 'query all posts' })
    async posts(): Promise<Document[]> {
        return PostModel.find({});
    }

    @Query(returns => LimitPost, { description: 'query posts by pagination' })
    async limitPosts(@Arg('pagination') pagination: PaginationInput): Promise<Posts> {
        const { currentPage, pageSize } = pagination;
        const posts = await PostModel.find({})
            .limit(pageSize)
            .skip((currentPage - 1) * pageSize);
        const total = await PostModel.estimatedDocumentCount();
        return { posts, pagination: { currentPage, pageSize, total } };
    }

    @Query(returns => Post, { description: 'query post by id' })
    async post(@Arg('id') id: string): Promise<Document> {
        return await PostModel.findById(id);
    }

    @Mutation(returns => Post, { description: 'add new post' })
    async addPost(@Arg('data') newPost: AddPostInput): Promise<Document> {
        const post = await PostModel.create(newPost);
        const { categories, tags, _id } = post;

        // push post id to saved categories
        await CategoriesModel.updateMany({ name: { $in: categories } }, { $push: { posts: _id } });
        // find unsaved categories and create it
        const savedCategories = await CategoriesModel.find({ name: { $in: categories } });
        const unSavedCategories = differenceBy(
            post.categories.map(name => ({ name })),
            savedCategories.map(({ name }) => ({ name })),
            'name',
        ).map(({ name }) => ({ name, posts: [_id] }));
        // saving categories
        await CategoriesModel.create(unSavedCategories);

        // push post id to saved tags
        await TagsModel.updateMany({ name: { $in: tags } }, { $push: { posts: _id } });
        // find unsaved tags and create it
        const savedTags = await TagsModel.find({ name: { $in: tags } });
        const unSavedTags = differenceBy(
            post.tags.map(name => ({ name })),
            savedTags.map(({ name }) => ({ name })),
            'name',
        ).map(({ name }) => ({ name, posts: [_id] }));
        // saving tags
        await TagsModel.create(unSavedTags);

        return post;
    }

    // Todo: update or delete should returns a state
    @Mutation(returns => Post, { description: 'delete post by id' })
    async deletePost(@Arg('id') id: string) {
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
