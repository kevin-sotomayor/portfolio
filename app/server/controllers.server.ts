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
    // TODO: form data type
    login: async (formData: any) => {
      try {
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
        const userHasSession = await prisma.session.findFirst({
          where: {
            user_id: user.id,
          },
        });
        if (userHasSession) {
          const payload = {
            username: user.username,
            profilePicture: user.image_url,
            pictureAlt: user.image_alt,
            sessionId: userHasSession.session_id,
          }
          return payload;
        }
        // If user doesn't have a session ID, we create one:
        const uuid = uuidv4();
        // TODO: encrypt the uuid instead of hashing it so we can decrypt and send it to the client if needed:
        const sessionId = await prisma.session.create({
          data: {
            session_id: uuid,
            user_id: user.id,
          }
        });
        if (!sessionId) {
          return null;
        }
        const payload = {
          username: user.username,
          profilePicture: user.image_url,
          pictureAlt: user.image_alt,
          sessionId: sessionId.session_id,
        }
        if (!payload) {
          // Something went wrong despite the checks above
          return null
        }
        return payload;
      } 
      catch (error) {
        return error;
      }
    },
    verifySession: async (cookie: any) => {
      // This method will check if the session is valid
      // As well as checking if someone is trying to generate an invalid session
      if (!cookie.sessionCookie) {
        return "Did not receive cookie";
      }
      try {
        const hashedUuid = cookie.sessionCookie;
        const session = await prisma.session.findUnique({
          where: {
            session_id: hashedUuid,
          },
        });
        if (!session) {
          return "ID not found in database";
        }
        const user = await prisma.user.findUnique({
          where: {
            id: session.user_id,
          },
        });
        if (!user) {
          return "Could not find user associated with session ID";
        }
        const data = {
          username: user.username,
          profilePicture: user.image_url,
          pictureAlt: user.image_alt,
        }
        return data;
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
      const token = uuidv4();
      const tokenData = await prisma.token.create({
        data: {
          value: token,
        },
      });
      if (!tokenData) {
        return null;
      }
      const encryptedTokenObject = encrypt(token);
      return encryptedTokenObject;
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
    verifyLoginForm: async (formTokenObject: any) => {
      if (!formTokenObject) {
        return null;
      }
      const encryptedTokenObject = {
        iv: formTokenObject.iv,
        encryptedData: formTokenObject.body,
      }
      const decryptedToken = decrypt(encryptedTokenObject);
      const token = await prisma.token.findUnique({
        where: {
          value: decryptedToken,
        }
      });
      if (!token) {
        return null;
      }
      // Form token is valid, we can now launch the login process:
      return true;
    },
  },
}

export default controllers;
