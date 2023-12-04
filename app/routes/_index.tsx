import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { sessionCookie } from "../server/cookies.server";
import globals from "../styles/globals.css";
import home from "../styles/home.css";


export const meta: MetaFunction = () => {
  return [
    { title: "Page d'accueil de mon Portfolio" },
    { name: "description", content: "Bienvenue !" },
  ];
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globals },
    { rel: "stylesheet", href: home },
  ];
}

export async function loader ({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await sessionCookie.parse(cookieHeader)) || {};
  return cookie;
}


export default function Index() {
  const data = useLoaderData();
  console.log(data);
  return (
    <main className="home">
      <h2>Page d'accueil</h2>
    </main>
  );
}
