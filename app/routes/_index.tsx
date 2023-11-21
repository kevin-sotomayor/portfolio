import type { MetaFunction, LinksFunction } from "@remix-run/node";

import globals from "../styles/globals.css";
import home from "../styles/home.css";


export const meta: MetaFunction = () => {
  return [
    { title: "Portfolio de Kevin Sotomayor" },
    { name: "description", content: "Bienvenue !" },
  ];
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globals },
    { rel: "stylesheet", href: home },
  ];
}

export default function Index() {
  return (
    <main className="home">
      <h2>Page d'accueil</h2>
    </main>
  );
}
