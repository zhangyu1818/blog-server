import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import Categories from './categories.type';

// mongoose model
import CategoriesModel from '../../schema/categories.db';
import PostModel from '../../schema/post.db';
import { PostType } from '../post/post.type';

/* eslint-disable*/
@Resolver()
class CategoriesResolver {
    @Query(returns => [Categories], { description: 'query categories' })
    async categories(@Arg('type', { defaultValue: PostType.published }) type: String) {
        return await CategoriesModel.find({}).populate({
            path: 'posts',
            match: { type },
        });
    }

    @Query(returns => Categories, { description: 'query category by id' })
    async category(@Arg('id') id: string) {
        return await CategoriesModel.findById(id).populate('posts');
    }

    @Mutation(returns => Categories, { description: 'create a new category', nullable: true })
    async addCategory(@Arg('name') name: string) {
        const isExist = await CategoriesModel.findOne({ name });
        if (isExist) return null;
        return await CategoriesModel.create({ name, posts: [] });
    }

    @Mutation(returns => Categories, { description: 'change category name' })
    async changeCategoryName(@Arg('id') id: string, @Arg('name') name: string) {
        // update category name,find old name
        const { name: oldName } = await CategoriesModel.findByIdAndUpdate(id, { name });
        // change posts ref categories name
        await PostModel.updateMany({ categories: oldName }, { 'categories.$': name });
        return await CategoriesModel.findById(id);
    }

    @Mutation(returns => Categories, { description: 'delete category by id' })
    async deleteCategory(@Arg('id') id: string) {
        const category = await CategoriesModel.findByIdAndDelete(id);
        const { name } = category;
        await PostModel.updateMany({ categories: name }, { $pull: { categories: name } });
        return category;
    }
}

export default CategoriesResolver;
