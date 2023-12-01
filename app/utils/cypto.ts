import { Buffer } from 'node:buffer';
const { createCipheriv, createDecipheriv, randomBytes } = await import('node:crypto');

const algorithm = 'aes-256-cbc';
const key = process.env.SECRET_TEST;
const iv = randomBytes(16);


export function encrypt(input: string) {
  if (!key) {
    throw new Error('Missing SECRET_TEST environment variable');
  }
  try {
    let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { 
      iv: iv.toString('hex'), 
      encryptedData: encrypted.toString('hex') 
    };
  } 
  catch (error) {
    throw new Error(error.message);
  }
}


export function decrypt(input: any) {
  if (!key) {
    throw new Error('Missing SECRET_TEST environment variable');
  }
  try {
    if (!input || !input.iv || !input.encryptedData) {
      throw new Error('Missing input to decrypt');
    }
    let iv = Buffer.from(input.iv, 'hex');
    let encryptedText = Buffer.from(input.encryptedData, 'hex');
    let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } 
  catch (error) {
    throw new Error(error.message);
  }
}
