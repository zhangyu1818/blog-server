import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    title: String,
    content: String,
    markdown: String,
    postedTime: Date,
    categories: Array,
    tags: Array,
});

const PostModel = model('posts', postSchema);

export default PostModel;
