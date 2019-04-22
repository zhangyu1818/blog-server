import { Resolver, Query, Arg } from 'type-graphql';
import Tags from './tags.type';

// mongoose model
import TagsModel from '../../schema/tags.db';

/* eslint-disable */
@Resolver()
class TagsResolver {
    @Query(returns => [Tags], { description: 'query tags' })
    async tags() {
        return await TagsModel.find({}).populate('posts');
    }

    @Query(returns => Tags, { description: 'query tag by id' })
    async tag(@Arg('id') id: string) {
        return await TagsModel.findById(id).populate('posts');
    }
}

export default TagsResolver;
