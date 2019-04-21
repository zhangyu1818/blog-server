import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Document } from 'mongoose';
import Post, { LimitPost } from './post.type';
import { AddPostInput, PaginationInput } from './post.input';
import PostModel from '../../schema/post';

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
        return await PostModel.create(newPost);
    }
}
export default PostResolver;
