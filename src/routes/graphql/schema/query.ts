import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { parse, ResolveTree, simplify } from 'graphql-parse-resolve-info';
import { PrismaContext } from '../types/context.js';
import { MemberType, MemberIdEnum } from '../types/member.js';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from '../types/profile.js';
import { UserType } from '../types/user.js';

interface MemberTypeArgs {
  id: string;
}

interface GetPostArgs {
  id: string;
}

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (source, args, { prisma, memberTypeLoader }: PrismaContext) => {
        const memberTypes = await prisma.memberType.findMany();

        memberTypes.forEach((memberType) =>
          memberTypeLoader.prime(memberType.id, memberType),
        );

        return memberTypes;
      },
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      args: {
        id: { type: new GraphQLNonNull(MemberIdEnum) },
      },
      resolve: async (
        source,
        { id }: MemberTypeArgs,
        { memberTypeLoader }: PrismaContext,
      ) => {
        return memberTypeLoader.load(id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source, args, { prisma, postLoader }: PrismaContext) => {
        const posts = await prisma.post.findMany();

        posts.forEach((post) => {
          postLoader.prime(post.id, post);
        });

        return posts;
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: GetPostArgs, { postLoader }: PrismaContext) => {
        return postLoader.load(id);
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (source, args, { prisma, profileLoaderId }: PrismaContext) => {
        const profiles = await prisma.profile.findMany();

        profiles.forEach((profile) => {
          profileLoaderId.prime(profile.id, profile);
        });

        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        source,
        { id }: { id: string },
        { profileLoaderId }: PrismaContext,
      ) => {
        return profileLoaderId.load(id);
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      async resolve(source, args, { prisma, userLoader }, data) {
        const { fields } = simplify(
          parse(data) as ResolveTree,
          new GraphQLList(UserType),
        );

        const users = await prisma.user.findMany({
          include: {
            subscribedToUser: 'subscribedToUser' in fields,
            userSubscribedTo: 'userSubscribedTo' in fields,
          },
        });

        users.forEach((user) => {
          userLoader.prime(user.id, user);
        });

        return users;
      },
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(source, { id }: { id: string }, { userLoader }) {
        return userLoader.load(id);
      },
    },
  },
});
