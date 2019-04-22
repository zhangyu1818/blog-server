import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

import PostResolver from './post/post.resolver';
import CategoriesResolver from './categories/categories.resolver';
import TagsResolver from './tags/tags.resolver';

const Schema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [PostResolver, CategoriesResolver, TagsResolver],
    });
};

export default Schema;
