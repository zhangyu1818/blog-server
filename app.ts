import dotenv from 'dotenv';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
// koa
import Koa from 'koa';
import Router from 'koa-router';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';

// graphql
import connect from './src/db';
import Schema from './src/graphql/schema';

// router
import user from './src/router/user';

// env init
dotenv.config();

// router init
const router = new Router();
router.use('/user', user);

const runServer = async (): Promise<void> => {
    // await mongoose connect
    await connect();
    // koa instance
    const app = new Koa();
    app.keys = ['blog server secret hurr'];
    app.use(logger())
        .use(bodyParser())
        .use(session(app))
        .use(router.routes())
        .use(router.allowedMethods());

    // apollo server init
    const schema = await Schema();
    const server = new ApolloServer({
        schema,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        context: ({ ctx }) => ({ ctx }),
    });
    server.applyMiddleware({ app });
    const port = process.env.PORT || 4000;
    // run
    app.listen({ port }, (): void => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
};

runServer().catch((e): void => console.log(e.message));
