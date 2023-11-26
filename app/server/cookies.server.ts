import { createCookie } from "@remix-run/node";

if (!process.env.COOKIE_SESSION_SECRET) {
  throw new Error("Missing COOKIE_SESSION_SECRET to sign cookies");
}

export const session = createCookie("__session", { 
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  secrets: [process.env.COOKIE_SESSION_SECRET],
  maxAge: (60 * 60 * 24) * 1, // 1 day,
});
