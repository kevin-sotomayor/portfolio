import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'

import regex from '../utils/regex';
import { encrypt, decrypt } from "../utils/cypto";


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
      // TODO: valid method, this one is only for dev purposes:
      await prisma.post.create({
        data: {
          title: formData.title,
          content: formData.content,
          published: formData.published,
          image_url: formData.image_url,
          image_alt: formData.image_alt,
          url: formData.url,
          author_id: formData.author_id,
        }
      });
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
    // TODO: form data type
    login: async (formData: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: formData.email,
          },
          include: {
            session: true,
          }
        });
        if (!user) {
          return null;
        }
        const match = await bcrypt.compare(formData.password, user.password);
        if (!match) {
          return null;
        }
        // Email and password are valid, we can now check if the user has a session ID:
        if (user.session) {
          const sessionId = encrypt(user.session.session_id);
          return sessionId;
        }
        // If the user doesn't have a session ID, we create one:
        if (!user.session) {
          const uuid = uuidv4();
          const sessionId = await prisma.session.create({
            data: {
              session_id: uuid,
              user_id: user.id,
            }
          });
          if (!sessionId) {
            return null;
          }
          const encryptedSessionId = encrypt(uuid);
          return encryptedSessionId;
        }
      } 
      catch (error) {
        return error;
      }
    },
    verifySession: async (cookie: any) => {
      if (!cookie.iv || !cookie.body) {
        return null;
      }
      try {
        const decryptedUuid = decrypt(cookie);
        if (!decryptedUuid) {
          return null;
        }
        const session = await prisma.session.findUnique({
          where: {
            session_id: decryptedUuid.toString(),
          },
        });
        if (!session || !session.user_id) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            id: session.user_id,
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
        // Here check what we want to return to the client:
        return payload;
      }
      catch (error) {
        return error;
      }
    },
  },
  tokens: {
    getAllTokens: async () => {
      const tokens = await prisma.token.findMany();
      if (!tokens) {
        return null;
      }
      return tokens;
    },
    createToken: async () => {
      const generatedUuid = uuidv4();
      const token = await prisma.token.create({
        data: {
          value: generatedUuid,
        },
      });
      if (!token) {
        return null;
      }
      return token.value;
    },
    deleteToken: async (token: string) => {
      const deleted = await prisma.token.delete({
        where: {
          value: token,
        },
      });
      if (!deleted) {
        return null;
      }
      return 0;
    },

    // TODO: FormDataEntry type for values coming from the form
    verifyLoginForm: async (formToken: any) => {
      if (!formToken) {
        return null;
      }
      const token = await prisma.token.findUnique({
        where: {
          value: formToken.id,
        }
      });
      if (!token) {
        return null;
      }
      // Form token is valid, we can now launch the login process:
      return token;
    },
  },
}

export default controllers;
