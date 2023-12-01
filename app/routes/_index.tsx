import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import globals from "../styles/globals.css";
import home from "../styles/home.css";
import { encrypt, decrypt } from "../utils/cypto";


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

export function loader () {
  const message = "test";
  const encrypted = encrypt(message);
  const decrypted = decrypt(encrypted);
  const objTest = {
    message: message,
    encrypted: encrypted,
    decrypted: decrypted,
  };
  return objTest;
}

export default function Index() {
  const test = useLoaderData();
  console.log(test);
  return (
    <main className="home">
      <h2>Page d'accueil</h2>
    </main>
  );
}
