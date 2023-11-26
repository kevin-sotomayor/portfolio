import type { LinksFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import admin from "../styles/admin.css";
import server from "../server/index.server";
import { redirect } from "react-router-dom";
import { session } from "../server/cookies.server";


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: admin }
  ]
}

// TODO: implement full session management with session ID :
// https://github.com/users/kevin-sotomayor/projects/4/views/2?pane=issue&itemId=45408838

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await session.parse(cookieHeader)) || {};
  // We check if the session ID is valid
  return json({ session: cookie.session });
}

// TODO: type
export async function action({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await session.parse(cookieHeader)) || {};
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData.entries());
  try {
    const result = await server.controllers.session.login(formDataObject);
    if (!result) {
      return null;
    }
    cookie.session = result.session.session_id;
    return redirect("/", {
      headers: {
        "Set-Cookie": await session.serialize(cookie),
      },
    });
  }
  catch (error) {
    return error;
  }
}

// TODO: text content in JSON file
export default function Admin() {
  // const { session } = useLoaderData();
  const test = useLoaderData();
  console.log(test);
  if (!session) {
    return (
      <main className="admin-page">
        <h2 className="admin-page__title">Admin</h2>
        <Form className="admin-page__form" method="post" preventScrollReset>
          <input className="admin-page__input" name="email" type="email" placeholder="Adresse mail" autoComplete="email" required/>
          <input className="admin-page__input" name="password" type="password" placeholder="Mot de passe" autoComplete="current_password" required/>
          <button className="admin-page__button" type="submit">Se connecter</button>
        </Form>
      </main>
    )
  }
}
 