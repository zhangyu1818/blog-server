import { Schema, model, Document } from 'mongoose';

interface Tags extends Document {
    name: string;
    post: Schema.Types.ObjectId[];
}

const tagsSchema = new Schema({
    name: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'posts' }],
});

const TagsModel = model<Tags>('tags', tagsSchema);

export default TagsModel;
