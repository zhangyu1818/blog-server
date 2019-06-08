import Router from 'koa-router';
import UserModel from '../schema/user.db';

const router = new Router();

router.post(
    '/login',
    async (ctx): Promise<void> => {
        const { userName, password } = ctx.request.body;
        // UserModel.create({ userName, password, type: 'admin' });
        const user = await UserModel.find({ userName, password });
        if (user) {
            ctx.session.userInfo = userName;
            ctx.response.body = { status: 'ok', type: 'account', currentAuthority: 'admin' };
        }
    },
);

router.get(
    '/checkUser',
    async (ctx): Promise<void> => {
        if (ctx.session.userInfo) {
            ctx.response.body = { status: 'ok', type: 'account', currentAuthority: 'admin' };
            return;
        }
        ctx.response.body = { status: 'error', type: 'account', currentAuthority: 'guest' };
    },
);

export default router.routes();
