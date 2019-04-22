import { ObjectType, Field } from 'type-graphql';

/* eslint-disable */
@ObjectType({ description: 'action response type' })
class ActionStatus {
    @Field(type => Boolean, { description: 'action status' })
    status: boolean;
    @Field(type => String, { description: 'action message' })
    message: string;
}

export default ActionStatus;
