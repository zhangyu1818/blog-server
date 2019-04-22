import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import Categories from './categories.type';

// mongoose model
import CategoriesModel from '../../schema/categories.db';

/* eslint-disable*/
@Resolver()
class CategoriesResolver {
    @Query(returns => [Categories], { description: 'query categories' })
    async categories() {
        return await CategoriesModel.find({}).populate('posts');
    }
    @Query(returns => Categories, { description: 'query category by id' })
    async category(@Arg('id') id: string) {
        return await CategoriesModel.findById(id).populate('posts');
    }
}

export default CategoriesResolver;
