import { PrismaClient } from '@prisma/client';

export interface LoaderProps {
  prisma: PrismaClient;
}

export interface ProfileLoaderProps extends LoaderProps {
  type: 'id' | 'userId';
}
