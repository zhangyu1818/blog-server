import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import Categories from './categories.type';

// mongoose model
import CategoriesModel from '../../schema/categories.db';
import PostModel from '../../schema/post.db';

/* eslint-disable*/
@Resolver()
class CategoriesResolver {
    // Todo: add new category when the categories are not exist it
    @Query(returns => [Categories], { description: 'query categories' })
    async categories() {
        return await CategoriesModel.find({}).populate('posts');
    }

    @Query(returns => Categories, { description: 'query category by id' })
    async category(@Arg('id') id: string) {
        return await CategoriesModel.findById(id).populate('posts');
    }

    // Todo: update or delete should returns a state
    @Mutation(returns => Categories, { description: 'change category name' })
    async changeCategoryName(@Arg('id') id: string, @Arg('name') name: string) {
        // update category name,find old name
        const { name: oldName } = await CategoriesModel.findByIdAndUpdate(id, { name });
        // change posts ref categories name
        await PostModel.updateMany({ categories: oldName }, { 'categories.$': name });
        return await CategoriesModel.findById(id);
    }
}

export default CategoriesResolver;
