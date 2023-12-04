import type { LinksFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

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

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await sessionCookie.parse(cookieHeader) || {};
  if (cookie.sessionCookie) {
    const session = await server.controllers.session.verifySession(cookie.sessionCookie);
    if (!session) {
      // Session is not valid or has expired:
      return redirect("/admin/login");
    }
    return redirect("/admin/dashboard");
  }
  if (!cookie.sessionCookie) {
    const formToken = await server.controllers.tokens.createToken();
    return formToken;
  }
}


// TODO: type
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  // Before anything, we can check if the data entered is valid (email, password) -> regex in utils :

  // We create an object containing the form token vector and body:
  const formId = {
    id: formData.get("formId"),
  }
  // If the form doesn't have a unique ID, we can't verify it:
  if (!formId) {
    return redirect("/admin/login");
  }
  try {
    const result = await server.controllers.tokens.verifyLoginForm(formId);
    if (!result) {
      // Token is not valid or has expired:
      return redirect("/admin/login");
    }
    // Form is verified, we can now treat the form:
    const formDataObject = {
      email: formData.get("email"),
      password: formData.get("password")
    }
    const session = await server.controllers.session.login(formDataObject);
    if (!session) {
      // Something went wrong with the login so we start over:
      return redirect("/admin/login"); 
    }
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await sessionCookie.parse(cookieHeader)) || {};
    cookie.sessionCookie = session;
    return redirect("/admin/dashboard", {
      headers: {
        "Set-Cookie": await sessionCookie.serialize(cookie)
      }
    });
  }
  catch (error) {
    return error;
  }
}

export default function AdminLogin() {
  const formToken = useLoaderData();
  return (
    <main className="admin-page">
      <Form className="admin-page__form" method="post">
        <input type="hidden" name="formId" value={`${formToken}`}/>
        <input className="admin-page__input" name="email" type="email" placeholder="Adresse mail" autoComplete="email" required/>
        <input className="admin-page__input" name="password" type="password" placeholder="Mot de passe" autoComplete="current_password" required/>
        <button className="admin-page__button" type="submit">Se connecter</button>
      </Form>
    </main>
  )
}
 