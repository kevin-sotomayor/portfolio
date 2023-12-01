import server from "./index.server";

// Server tasks must be imported -> entry.server.tsx

export async function clearTokens () {
  setInterval(async () => {
    const tokens = await server.controllers.tokens.getAllTokens();
    if (!tokens) {
      return null;
    }
    const now = new Date();
    // We use good old for loop for performance :
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      // if tokens is older than 10 minutes, delete it :
      if ((now.getTime() - token.created_at.getTime()) > (1000 * 60 * 10)) {
        await server.controllers.tokens.deleteToken(token.value);
      }
    }
    return null;
  }, (1000 * 60 * 10)); // runs every 10 minutes
}
