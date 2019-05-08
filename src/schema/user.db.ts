import { Schema, model, Document } from 'mongoose';

interface User extends Document {
    userName: string;
    password: string;
    type: string;
}

const userSchema = new Schema({
    userName: String,
    password: String,
    type: String,
});

const UserModel = model<User>('user', userSchema);

export default UserModel;
