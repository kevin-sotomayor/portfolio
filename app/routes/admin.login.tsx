import type { LinksFunction, HeadersFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid'

import admin from "../styles/admin.css";
import server from "../server/index.server";
import { redirect } from "react-router-dom";

import { sessionCookie } from "../server/cookies.server";
// import { encrypt, decrypt } from "../utils/cypto";


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
    const formId = await server.controllers.tokens.createToken();
    return formId;
  }
}

// TODO: type
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData.entries());
  // try {
  //   const result = await server.controllers.session.login(formDataObject);
  //   if (!result) {
  //     return null;
  //   }
  //   const cookieHeader = request.headers.get("Cookie");
  //   const cookie = (await sessionCookie.parse(cookieHeader)) || {};
  //   cookie.sessionCookie = result.session_id;
  //   return redirect("/admin/dashboard", {
  //     headers: {
  //       "Set-Cookie": await sessionCookie.serialize(cookie)
  //     }
  //   });
  //   return formDataObject;
  // }
  // catch (error) {
  //   return error;
  // }
  try {
    const isSecured = await server.controllers.tokens.verifyToken(formDataObject.formId);
    if (!isSecured) {
      // Token is not valid or has expired:
      return redirect("/admin/login");
    }
    // Token is valid and we can treat the form:
    const result = await server.controllers.session.login(formDataObject);
    if (!result) {
      // Data passed in the ford are not valid:
      return null; 
    }
    // Data passed in the form are valid:
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await sessionCookie.parse(cookieHeader)) || {};
    cookie.sessionCookie = result.session_id;
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
  // TODO: encrypt csrfToken
  const formId = useLoaderData();
  return (
    <main className="admin-page">
      <h2 className="admin-page__title">Admin</h2>
      <Form className="admin-page__form" method="post">
        <input type="hidden" name="formId" value={`${formId}`} />
        <input className="admin-page__input" name="email" type="email" placeholder="Adresse mail" autoComplete="email" required/>
        <input className="admin-page__input" name="password" type="password" placeholder="Mot de passe" autoComplete="current_password" required/>
        <button className="admin-page__button" type="submit">Se connecter</button>
      </Form>
    </main>
  )
}
 