import { Buffer } from 'node:buffer';
const { createCipheriv, createDecipheriv, randomBytes } = await import('node:crypto');

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;


export function encrypt(input: string) {
  if (!key) {
    throw new Error('Missing ENCRYPTION_KEY environment variable');
  }
  const iv = randomBytes(16);
  try {
    let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { 
      iv: iv.toString('hex'), 
      body: encrypted.toString('hex') 
    };
  } 
  catch (error) {
    return error;
  }
}


export function decrypt(input: any) {
  if (!key) {
    throw new Error('Missing ENCRYPTION_KEY environment variable');
  }
  try {
    if (!input || !input.iv || !input.body) {
      throw new Error('Missing input to decrypt');
    }
    let iv = Buffer.from(input.iv, 'hex');
    let encryptedText = Buffer.from(input.body, 'hex');
    let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } 
  catch (error) {
    return error;
  }
}
