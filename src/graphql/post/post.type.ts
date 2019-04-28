import { ObjectType, Field, ID, Int } from 'type-graphql';

enum PostType {
    'draft' = 'draft',
    'published' = 'published',
    'trash' = 'trash',
}

/* eslint-disable */
@ObjectType()
class Post {
    @Field(type => ID)
    _id: string;

    @Field(type => String)
    title: string;

    @Field(type => String)
    content: string;

    @Field(type => String)
    markdown: string;

    @Field(type => Date)
    postedTime: Date;

    @Field(type => Date, { nullable: true })
    updateTime: Date;

    @Field(type => Int)
    revisionCount: number;

    @Field(type => [String], { nullable: 'items' })
    categories: string[];

    @Field(type => [String], { nullable: 'items' })
    tags: string[];

    @Field(type => String)
    type: string;
}

@ObjectType()
class Pagination {
    @Field(type => Int)
    currentPage: number;

    @Field(type => Int)
    pageSize: number;

    @Field(type => Int)
    total: number;
}

@ObjectType()
class LimitPost {
    @Field(type => [Post])
    posts: [Post];

    @Field(type => Pagination)
    pagination: Pagination;
}

export default Post;
export { Pagination, LimitPost, PostType };
