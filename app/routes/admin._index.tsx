import type { LinksFunction } from "@remix-run/node"

import admin from "../styles/admin.css";


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: admin }
  ]
}

export default function Admin() {
  return (
    <main className="admin-page">
      <h2 className="admin-page__title">Admin</h2>
      <form className="admin-page__form" action="">
        <input className="admin-page__input" type="email" placeholder="Adresse mail" autoComplete="email"/>
        <input className="admin-page__input" type="password" placeholder="Mot de passe" autoComplete="current_password"/>
        <button className="admin-page__button">Se connecter</button>
      </form>
    </main>
  )
}
 