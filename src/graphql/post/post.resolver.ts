import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Document } from 'mongoose';
import { differenceBy } from 'lodash';

import Post, { LimitPost } from './post.type';
import { AddPostInput, PaginationInput } from './post.input';
import ActionStatus from '../common/actionStatus';

// mongoose model
import PostModel from '../../schema/post.db';
import CategoriesModel from '../../schema/categories.db';

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

    @Mutation(type => Post, { description: 'add new post' })
    async addPost(@Arg('data') newPost: AddPostInput): Promise<Document> {
        const post = await PostModel.create(newPost);
        const { categories, _id } = post;
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
        // Todo: if tags exist,push post id,else create a new tag
        return post;
    }
    @Mutation(returns => ActionStatus, { description: 'delete post by id' })
    async deletePost(@Arg('id') id: string) {
        const { categories } = await PostModel.findById(id);
        // Todo: remove ref categories when the post delete
        // const status = await PostModel.findByIdAndDelete(id);
        console.log(categories);
    }
}
export default PostResolver;
