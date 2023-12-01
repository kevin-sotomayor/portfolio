import { Buffer } from 'node:buffer';
const { scrypt, randomFill, createCipheriv, createDecipheriv, scryptSync } = await import('node:crypto');

export function encrypt (text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Env variables checkup :
    if (!process.env.SECRET_TEST || !process.env.SALT_TEST) {
      reject(Error("Secret or salt cannot be empty"));
    }

    // Env variables checkup is ok, we can proceed :
    const algorithm = "aes-192-cbc";

    scrypt(process.env.SECRET_TEST!, process.env.SALT_TEST!, 24, (error, key) => {
      if (error) {
        throw error;
      }

      randomFill(new Uint8Array(16), (error, iv) => {
        if (error) {
          reject(error);
        }

        // We have the key and the iv, now we create the cipher:
        const cipher = createCipheriv(algorithm, key, iv);
        let encrypted = "";
        cipher.setEncoding("hex");
        
        cipher.on("data", (chunk) => encrypted += chunk);
        cipher.on("end", () => resolve(encrypted));
        
        cipher.write(text);
        cipher.end();
      });
    });
  });
}

export function decrypt (encryptedData: string): Promise <string> {
  return new Promise((resolve, reject) => {
    if (!process.env.SECRET_TEST || !process.env.SALT_TEST) {
      reject(Error("Secret or salt cannot be empty"));
    }

    // Env variables checkup is ok, we can proceed :
    const algorithm = "aes-192-cbc";

    const key = scryptSync(process.env.SECRET_TEST!, process.env.SALT_TEST!, 24);

    
    const iv = Buffer.alloc(16, 0);
    const decipher = createDecipheriv(algorithm, key, iv);

    let decrypted = "";
    decipher.on("readable", () => {
      let chunk;
      while (null !== (chunk = decipher.read())) {
        decrypted += chunk.toString("utf8");
      }
    });
    decipher.on("end", () => resolve(decrypted));
    decipher.write(encryptedData, "hex");
    decipher.end();
  });
}

