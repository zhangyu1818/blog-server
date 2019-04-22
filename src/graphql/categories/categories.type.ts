import { ObjectType, Field } from 'type-graphql';
import Post from '../post/post.type';

/* eslint-disable */
@ObjectType()
class Categories {
    @Field(type => String)
    name: string;
    @Field(type => [Post])
    posts: [Post];
}

export default Categories;
