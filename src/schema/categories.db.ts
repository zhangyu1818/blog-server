import { Schema, model, Document } from 'mongoose';

interface Categories extends Document {
    name: string;
    post: Schema.Types.ObjectId[];
}

const categoriesSchema = new Schema({
    name: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'posts' }],
});

const CategoriesModel = model<Categories>('categories', categoriesSchema);

export default CategoriesModel;
