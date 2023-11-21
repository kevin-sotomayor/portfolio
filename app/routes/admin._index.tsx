import type { LinksFunction, ActionFunctionArgs } from "@remix-run/node"
import { Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";


import admin from "../styles/admin.css";

import status from "../json/status.json";


const prisma = new PrismaClient();


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: admin }
  ]
}

// TODO: type
export async function action({ request }: { request: any }) {
  const body = await request.formData();
  const data = Object.fromEntries(body.entries());
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });
  if (!user) {
    return json(status.error.login_failure);
  }
  return user;
}

// TODO: text content in JSON file
export default function Admin() {
  // const user = useLoaderData();
  return (
    <main className="admin-page">
      <h2 className="admin-page__title">Admin</h2>
      <Form className="admin-page__form" method="post" preventScrollReset>
        <input className="admin-page__input" name="email" type="email" placeholder="Adresse mail" autoComplete="" required/>
        <input className="admin-page__input" name="password" type="password" placeholder="Mot de passe" autoComplete="current_password" required/>
        <button className="admin-page__button" type="submit">Se connecter</button>
      </Form>
    </main>
  )
}
 