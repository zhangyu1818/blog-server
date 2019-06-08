import { Resolver, Query, Arg, Mutation, Authorized } from 'type-graphql';
import { Document } from 'mongoose';
import Tags from './tags.type';

// mongoose model
import TagsModel from '../../schema/tags.db';
import PostModel from '../../schema/post.db';
import { PostType } from '../post/post.type';

/* eslint-disable */
@Resolver()
class TagsResolver {
    @Query(returns => [Tags], { description: 'query tags' })
    async tags(@Arg('type', { defaultValue: PostType.published }) type: String): Promise<Document[]> {
        return await TagsModel.find({}).populate('posts');
    }

    @Query(returns => Tags, { description: 'query tag by id' })
    async tag(@Arg('id') id: string): Promise<Document> {
        return await TagsModel.findById(id).populate('posts');
    }

    @Authorized()
    @Mutation(returns => Tags, { description: 'create a new tag', nullable: true })
    async addTag(@Arg('name') name: string): Promise<null | Document> {
        const isExist = await TagsModel.findOne({ name });
        if (isExist) return null;
        return await TagsModel.create({ name, posts: [] });
    }

    @Authorized()
    @Mutation(returns => Tags, { description: 'change tag name' })
    async changeTagName(@Arg('id') id: string, @Arg('name') name: string): Promise<Document> {
        // update tag name,find old name
        const { name: oldName } = await TagsModel.findByIdAndUpdate(id, { name });
        // change posts ref tag name
        await PostModel.updateMany({ tags: oldName }, { 'tags.$': name });
        return await TagsModel.findById(id);
    }

    @Authorized()
    @Mutation(returns => Tags, { description: 'delete tag by id' })
    async deleteTag(@Arg('id') id: string): Promise<Document> {
        const tag = await TagsModel.findByIdAndDelete(id);
        const { name } = tag;
        await PostModel.updateMany({ tags: name }, { $pull: { tags: name } });
        return tag;
    }
}

export default TagsResolver;
