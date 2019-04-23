import { InputType, Field } from 'type-graphql';
import Post from './post.type';

/* eslint-disable */
@InputType({ description: 'post input type' })
class AddPostInput implements Partial<Post> {
    @Field(type => String)
    title: string;

    @Field(type => String)
    content: string;

    @Field(type => String)
    markdown: string;

    @Field(type => [String], { nullable: true })
    categories?: string[];

    @Field(type => [String], { nullable: true })
    tags?: string[];
}

@InputType({ description: 'post update input type' })
class UpdatePostInput implements Partial<Post> {
    @Field(type => String, { nullable: true })
    title?: string;

    @Field(type => String, { nullable: true })
    content?: string;

    @Field(type => String, { nullable: true })
    markdown?: string;

    @Field(type => [String], { nullable: true })
    categories?: string[];

    @Field(type => [String], { nullable: true })
    tags?: string[];
}
@InputType({ description: 'pagination input' })
class PaginationInput {
    @Field(type => Number, { defaultValue: 1 })
    currentPage: number;

    @Field(type => Number, { defaultValue: 10 })
    pageSize: number;
}

export { AddPostInput, UpdatePostInput, PaginationInput };
