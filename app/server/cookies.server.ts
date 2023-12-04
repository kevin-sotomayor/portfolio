import { createCookie } from "@remix-run/node";

import { encrypt, decrypt } from "../utils/cypto"; 

if (!process.env.COOKIE_SECRET) {
  throw new Error("Missing COOKIE_SECRET to sign cookies");
}

export const sessionCookie = createCookie("__session", {
  httpOnly: process.env.NODE_ENV === "production", // prevents cross scripting attacks
  sameSite: "lax", // helps prevent cross site request forgery to some extent
  path: "/",
  maxAge: 3600, // 1 hour
  secrets: [process.env.COOKIE_SECRET],
  secure: process.env.NODE_ENV === "production",
});
