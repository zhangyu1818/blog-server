import { ObjectType, Field, ID } from 'type-graphql';
import Post from '../post/post.type';

export interface CategoriesType {
    _id: string;
    name: string;
    posts: Post[];
}

/* eslint-disable */
@ObjectType()
class Categories {
    @Field(type => ID)
    _id: string;

    @Field(type => String)
    name: string;

    @Field(type => [Post])
    posts: [Post];
}

export default Categories;
