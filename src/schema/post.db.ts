import { Schema, model, Document } from 'mongoose';

interface Post extends Document {
    title: string;
    content: string;
    markdown: string;
    postedTime: Date;
    updateTime: Date | null;
    categories: string[];
    tags: string[];
}

const postSchema = new Schema({
    title: String,
    content: String,
    markdown: String,
    postedTime: Date,
    updateTime: Date,
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
});

const PostModel = model<Post>('posts', postSchema);

export default PostModel;
