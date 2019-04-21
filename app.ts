import dotenv from 'dotenv';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import Koa from 'koa';

import connect from './src/db';
import Schema from './src/graphql/schema';

dotenv.config();

const runServer = async (): Promise<void> => {
    const app = new Koa();
    await connect();
    const schema = await Schema();
    const server = new ApolloServer({
        schema,
    });
    server.applyMiddleware({ app });
    const port = process.env.PORT || 4000;
    app.listen({ port }, (): void => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
};

runServer().catch((e): void => console.log(e.message));
