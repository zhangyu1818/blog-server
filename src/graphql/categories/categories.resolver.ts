import { Resolver, Query, Arg, Mutation, Authorized } from 'type-graphql';
import { Document } from 'mongoose';
import Categories from './categories.type';

// mongoose model
import CategoriesModel from '../../schema/categories.db';
import PostModel from '../../schema/post.db';
import { PostType } from '../post/post.type';

/* eslint-disable*/
@Resolver()
class CategoriesResolver {
    @Query(returns => [Categories], { description: 'query categories' })
    async categories(@Arg('type', { defaultValue: PostType.published }) type: String): Promise<Document[]> {
        return await CategoriesModel.find({}).populate({
            path: 'posts',
            match: { type },
        });
    }

    @Query(returns => Categories, { description: 'query category by id' })
    async category(@Arg('id') id: string): Promise<Document> {
        return await CategoriesModel.findById(id).populate('posts');
    }

    @Authorized()
    @Mutation(returns => Categories, { description: 'create a new category', nullable: true })
    async addCategory(@Arg('name') name: string): Promise<null | Document> {
        const isExist = await CategoriesModel.findOne({ name });
        if (isExist) return null;
        return await CategoriesModel.create({ name, posts: [] });
    }

    @Authorized()
    @Mutation(returns => Categories, { description: 'change category name' })
    async changeCategoryName(@Arg('id') id: string, @Arg('name') name: string): Promise<Document> {
        // update category name,find old name
        const { name: oldName } = await CategoriesModel.findByIdAndUpdate(id, { name });
        // change posts ref categories name
        await PostModel.updateMany({ categories: oldName }, { 'categories.$': name });
        return await CategoriesModel.findById(id);
    }

    @Authorized()
    @Mutation(returns => Categories, { description: 'delete category by id' })
    async deleteCategory(@Arg('id') id: string): Promise<Document> {
        const category = await CategoriesModel.findByIdAndDelete(id);
        const { name } = category;
        await PostModel.updateMany({ categories: name }, { $pull: { categories: name } });
        return category;
    }
}

export default CategoriesResolver;
