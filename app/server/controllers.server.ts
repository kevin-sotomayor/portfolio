import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";

import regex from '../utils/regex';


const prisma = new PrismaClient();

const saltRounds = 12;


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
    createPost: async (formData: any) => {
      // placeholder
    },
    updatePost: async (formData: any) => {
      // placeholder
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
    createUser: async (formData: any) => {
      const isEmailValid = regex.email.test(formData.email);
      if (!isEmailValid) {
        return null;
      }
      const isUsernameValid = regex.username.test(formData.username);
      if (!isUsernameValid) {
        return null;
      }
      const isPasswordValid = regex.password.test(formData.password);
      if (!isPasswordValid) {
        return null;
      }
      const hashedPassword = bcrypt.hashSync(formData.password, saltRounds);
      const user = await prisma.user.create({
        data: {
          username: formData.username,
          email: formData.email,
          password: hashedPassword,
          image_url: formData.profilePicture,
          image_alt: formData.pictureAlt,
        },
      });
      if (!user) {
        return null;
      }
      const payload = {
        username: user.username,
        profilePicture: user.image_url,
        pictureAlt: user.image_alt,
      }
      return payload;
    },
  },
  session: {
    generateSessionId: (user: any) => {
      const id = uuidv4();
      const hashedId = bcrypt.hashSync(id, saltRounds);
      const result = prisma.session.create({
        data: {
          session_id: hashedId,
          user_id: user.id,
        },
      });
      if (!result) {
        return null;
      }
      return result;
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
      const match = await bcrypt.compare(formData.password, user.password);
      if (!match) {
        return null;
      }
      // Here we return session ID:
      const session = controllers.session.generateSessionId(user);
      if (!session) {
        return null;
      }
      const result = {
        username: user.username,
        profilePicture: user.image_url,
        pictureAlt: user.image_alt,
        sessionId: session,
      }
      return result;
    },
  },
  checkSessionValidy: async (sessionId: string) => {
    const isValid = await prisma.session.findUnique({
      where: {
        session_id: sessionId,
      },
    });
    if (!isValid) {
      return false;
    }
    return true;
  },
}

export default controllers;