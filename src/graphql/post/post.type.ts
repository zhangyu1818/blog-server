import { ObjectType, Field, ID } from 'type-graphql';

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

    @Field(type => [String], { nullable: false })
    categories: string[];

    @Field(type => [String], { nullable: false })
    tags: string[];
}

@ObjectType()
class Pagination {
    @Field(type => Number)
    currentPage: number;

    @Field(type => Number)
    pageSize: number;

    @Field(type => Number)
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
export { Pagination, LimitPost };
