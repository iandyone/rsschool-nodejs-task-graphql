import { PrismaClient } from '@prisma/client';
import {
  memberTypeLoader,
  postsLoader,
  postLoader,
  profileLoader,
  userLoader,
} from './loaders.js';

export const getGraphQLContext = (prisma: PrismaClient) => {
  return {
    prisma,
    userLoader: userLoader({ prisma }),
    postLoader: postLoader({ prisma }),
    postsLoader: postsLoader({ prisma }),
    memberTypeLoader: memberTypeLoader({ prisma }),
    profileLoaderId: profileLoader({ prisma, type: 'id' }),
    profileLoaderUserId: profileLoader({ prisma, type: 'userId' }),
  };
};
