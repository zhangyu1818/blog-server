import { Schema, model, Document } from 'mongoose';

interface Post extends Document {
    title: string;
    content: string;
    markdown: string;
    postedTime: Date;
    categories: string[];
    tags: string[];
}

const postSchema = new Schema({
    title: String,
    content: String,
    markdown: String,
    postedTime: Date,
    categories: [String],
    tags: [String],
});

const PostModel = model<Post>('posts', postSchema);

export default PostModel;
