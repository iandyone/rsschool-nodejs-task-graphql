import DataLoader from 'dataloader';
import { LoaderProps, ProfileLoaderProps } from './types/loaders.js';

export const memberTypeLoader = ({ prisma }: LoaderProps) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: [...ids] } },
    });

    return ids.map((id) => memberTypes.find((type) => id === type.id));
  });
};

export const postLoader = ({ prisma }: LoaderProps) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { id: { in: [...ids] } },
    });

    return ids.map((id) => posts.find((post) => id === post.id));
  });
};

export const postsLoader = ({ prisma }: LoaderProps) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...ids] } },
    });

    const authoredPosts = posts.reduce((acc, post) => {
      const key = post.authorId;
      acc[key] = acc[key] ? [...acc[key], post] : [post];
      return acc;
    }, {});

    return ids.map((id) => authoredPosts[id] || []);
  });
};

export const profileLoader = ({ prisma, type }: ProfileLoaderProps) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { [type]: { in: [...ids] } },
    });

    return ids.map((id) => profiles.find((profile) => id === profile[type]));
  });
};

export const userLoader = ({ prisma }: LoaderProps) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...ids] } },
      include: {
        subscribedToUser: true,
        userSubscribedTo: true,
      },
    });

    return ids.map((id) => users.find((user) => id === user.id));
  });
};
