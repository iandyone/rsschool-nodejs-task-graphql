import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { PrismaContext } from './context.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async ({ id }, args, { profileLoaderUserId }: PrismaContext) => {
        return profileLoaderUserId.load(id as string);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async ({ id }, args, { postsLoader }: PrismaContext) => {
        return postsLoader.load(id as string);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async ({ userSubscribedTo }, args, { userLoader }: PrismaContext) => {
        return userSubscribedTo.map((subscription) =>
          userLoader.load(subscription.authorId as string),
        );
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async ({ subscribedToUser }, args, { userLoader }: PrismaContext) => {
        return subscribedToUser.map((subscribtion) =>
          userLoader.load(subscribtion.subscriberId as string),
        );
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export interface UserArgs {
  name: string;
  balance: number;
}
export interface CreateUserArgs {
  dto: UserArgs;
}
export interface ChangeUserArgs extends CreateUserArgs {
  id: string;
}
