import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

import PostResolver from './post/post.resolver';
import CategoriesResolver from './categories/categories.resolver';

const Schema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [PostResolver, CategoriesResolver],
    });
};

export default Schema;
