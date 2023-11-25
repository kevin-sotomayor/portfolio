import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as uuid from "uuid";


const prisma = new PrismaClient();


// TODO: add types
// TODO: add error handling

const controllers = {
  posts: {
    getAllPosts: async () => {
      const posts = await prisma.post.findMany({
        where: {
          published: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          author: {
            select: {
              username: true,
            }
          },
        },
        
      });
      if (!posts) {
        return null;
      }
      return posts;
    },
    getPostBySlug: async (slug: string) => {
      const post = await prisma.post.findUnique({
        where : {
          url: slug,
        },
        include: {
          author: {
            select: {
              username: true,
              image_url: true,
            }
          },
        }
      });
      if (!post) {
        return null;
      }
      return post;
    },
  },
  users: {
    getOneUserByMail: async (email: string) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return null;
      }
      return user;
    },
  },
  session: {
    generateSessionId: (user: any) => {
      const session = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      // TODO: create ID with uuid
    },
    // TODO: form data type
    login: async (formData: any) => {
      const user = await prisma.user.findUnique({
        where: {
          email: formData.email,
        },
      });
      if (!user) {
        return null;
      }
      // const match = await bcrypt.compare(formData.password, user.password);
      const match = formData.password === user.password;
      if (!match) {
        return null;
      }
      // Here we return session ID:
      // return controllers.session.generateSessionId(user);
      return user;
    },
  },
}

export default controllers;