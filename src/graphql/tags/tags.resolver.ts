import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import Tags from './tags.type';

// mongoose model
import TagsModel from '../../schema/tags.db';
import PostModel from '../../schema/post.db';
import { PostType } from '../post/post.type';

/* eslint-disable */
@Resolver()
class TagsResolver {
    @Query(returns => [Tags], { description: 'query tags' })
    async tags(@Arg('type', { defaultValue: PostType.published }) type: String) {
        return await TagsModel.find({}).populate('posts');
    }

    @Query(returns => Tags, { description: 'query tag by id' })
    async tag(@Arg('id') id: string) {
        return await TagsModel.findById(id).populate('posts');
    }

    @Mutation(returns => Tags, { description: 'create a new tag', nullable: true })
    async addTag(@Arg('name') name: string) {
        const isExist = await TagsModel.findOne({ name });
        if (isExist) return null;
        return await TagsModel.create({ name, posts: [] });
    }

    @Mutation(returns => Tags, { description: 'change tag name' })
    async changeTagName(@Arg('id') id: string, @Arg('name') name: string) {
        // update tag name,find old name
        const { name: oldName } = await TagsModel.findByIdAndUpdate(id, { name });
        // change posts ref tag name
        await PostModel.updateMany({ tags: oldName }, { 'tags.$': name });
        return await TagsModel.findById(id);
    }

    @Mutation(returns => Tags, { description: 'delete tag by id' })
    async deleteTag(@Arg('id') id: string) {
        const tag = await TagsModel.findByIdAndDelete(id);
        const { name } = tag;
        await PostModel.updateMany({ tags: name }, { $pull: { tags: name } });
        return tag;
    }
}

export default TagsResolver;
