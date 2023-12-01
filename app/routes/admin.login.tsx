import type { LinksFunction, HeadersFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid'

import admin from "../styles/admin.css";
import server from "../server/index.server";
import { redirect } from "react-router-dom";

import { sessionCookie } from "../server/cookies.server";
import { encrypt, decrypt } from "../utils/cypto";


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: admin }
  ]
}

export const header: HeadersFunction = () => {
  return {
    "Cache-Control": "max-age=0"
  }
}


export async function loader({ request }: { request: Request }) {
  // Cookie management :
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await sessionCookie.parse(cookieHeader)) || {};
  if (cookie.sessionCookie) {
    // const isSession = await server.controllers.session.verifySession(cookie)
    return redirect("/admin/dashboard");
  }
  if (!cookie.sessionCookie) {
    const encryptedTokenObject = await server.controllers.tokens.createToken();
    return encryptedTokenObject;
  }
}

// TODO: type
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  // We create an object containing the form token vector and body:
  const formTokenObject = {
    iv: formData.get("formTokenVector"),
    body: formData.get("formTokenBody")
  }
  if (!formTokenObject.iv || !formTokenObject.body) {
    // At least one of the components of the token is missing:
    return null;
  }
  // Token object is complete, we can now verify it:
  try {
    const result = await server.controllers.tokens.verifyLoginForm(formTokenObject);
    if (!result) {
      // Token is not valid or has expired:
      return redirect("/admin/login");
    }
    // Boolean for now:
    if (result !== true) {
      return null;
    }
    // Form is verified, we can now treat the form:
    const formDataObject = {
      email: formData.get("email"),
      password: formData.get("password")
    }
    const user = await server.controllers.session.login(formDataObject);
    if (!user) {
      // User not found or password is not valid:
      return null; 
    }
    // User is found and password is valid -> we can create a session:
    // const cookieHeader = request.headers.get("Cookie");
    // const cookie = (await sessionCookie.parse(cookieHeader)) || {};
    // cookie.sessionCookie = result.session_id;
    // return redirect("/admin/dashboard", {
    //   headers: {
    //     "Set-Cookie": await sessionCookie.serialize(cookie)
    //   }
    // });
    return user;
  }
  catch (error) {
    return error;
  }
}

export default function AdminLogin() {
  const formToken = useLoaderData();
  return (
    <main className="admin-page">
      <h2 className="admin-page__title">Admin</h2>
      <Form className="admin-page__form" method="post">
        <input type="hidden" name="formTokenVector" value={`${formToken.iv}`}/>
        <input type="hidden" name="formTokenBody" value={`${formToken.body}`} />
        <input className="admin-page__input" name="email" type="email" placeholder="Adresse mail" autoComplete="email" required/>
        <input className="admin-page__input" name="password" type="password" placeholder="Mot de passe" autoComplete="current_password" required/>
        <button className="admin-page__button" type="submit">Se connecter</button>
      </Form>
    </main>
  )
}
 