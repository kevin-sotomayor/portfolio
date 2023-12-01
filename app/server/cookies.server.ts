import { createCookie } from "@remix-run/node";

if (!process.env.COOKIE_SECRET) {
  throw new Error("Missing COOKIE_SECRET to sign cookies");
}

export const sessionCookie = createCookie("__session", {
  httpOnly: process.env.NODE_ENV === "production", // prevents cross scripting attacks
  sameSite: "lax", // prevents cross site request forgery at some extent
  path: "/",
  maxAge: 10,
  secrets: [process.env.COOKIE_SECRET],
  secure: process.env.NODE_ENV === "production",
});
