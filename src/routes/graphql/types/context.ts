import { PrismaClient } from '@prisma/client';
import {
  memberTypeLoader,
  postsLoader,
  postLoader,
  profileLoader,
  userLoader,
} from '../loaders.js';

export interface PrismaContext {
  prisma: PrismaClient;
  memberTypeLoader: ReturnType<typeof memberTypeLoader>;
  postsLoader: ReturnType<typeof postsLoader>;
  postLoader: ReturnType<typeof postLoader>;
  profileLoaderId: ReturnType<typeof profileLoader>;
  profileLoaderUserId: ReturnType<typeof profileLoader>;
  userLoader: ReturnType<typeof userLoader>;
}
