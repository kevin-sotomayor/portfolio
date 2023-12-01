import { createCookie } from "@remix-run/node";

if (!process.env.SECRET_TEST) {
  throw new Error("Missing COOKIE_SESSION_SECRET to sign cookies");
}

export const sessionCookie = createCookie("__session", {
  httpOnly: process.env.NODE_ENV === "production", // prevents cross scripting attacks
  sameSite: "lax", // prevents cross site request forgery at some extent
  path: "/",
  maxAge: 10,
  secrets: [process.env.SECRET_TEST],
  secure: process.env.NODE_ENV === "production",
});
