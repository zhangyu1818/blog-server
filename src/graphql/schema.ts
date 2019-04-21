import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

import PostResolver from './post/post.resolver';

const Schema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [PostResolver],
    });
};

export default Schema;
