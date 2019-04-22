import { Schema, model, Document } from 'mongoose';

interface Categories extends Document {
    name: string;
    post: Schema.Types.ObjectId[];
}

const categoriesSchema = new Schema({
    name: String,
    posts: { type: [{ type: Schema.Types.ObjectId, ref: 'posts' }], required: false },
});

const CategoriesModel = model<Categories>('categories', categoriesSchema);

export default CategoriesModel;
