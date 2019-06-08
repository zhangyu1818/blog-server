import { AuthChecker } from 'type-graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authChecker: AuthChecker<any> = ({ context: { ctx } }): boolean => !!ctx.session.userInfo;

export default authChecker;
