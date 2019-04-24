import mongoose from 'mongoose';

const connect = (): void => {
    mongoose
        .connect(
            process.env.DB,
            { useNewUrlParser: true, useFindAndModify: false },
        )
        .then((): void => console.log('🚀 connect mongodb success'))
        .catch((): void => console.log('connect mongodb failed'));
};
export default connect;
