import type { LinksFunction } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { sessionCookie } from "../server/cookies.server";
import server from "../server/index.server";
import dashboard from "../json/dashboard.json";
import dashboardStyles from "../styles/dashboard.css";


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: dashboardStyles }
  ]
}



export async function loader ({ request, response }: { request: Request, response: Response}) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await sessionCookie.parse(cookieHeader) || {};
  if (cookie.sessionCookie) {
    const session = await server.controllers.session.verifySession(cookie.sessionCookie);
    if (!session) {
      return redirect("/admin/login");
    }
    if (session) {
      return json(session);
    }
  }
  if (!cookie.sessionCookie) {
    return redirect("/admin/login");
  }
}

export default function AdminDashboard() {
  const user: any = useLoaderData();
  return (
    <main className="dashboard-page">
      <section className="dashboard-page__header">
        <h2 className="header__title">Dashboard</h2>
        <h3 className="header__welcome">Bienvenue {user.username}</h3>
        <img className="header__profile-pic" src={user.image_url} alt={user.image_alt}/>
        <p className="header__question">Que voulez-vous faire aujourd'hui ? 😋</p>
      </section>
      <section className="dashboard-page__sections">
        <nav className="sections__nav">
          <ul className="sections__list">
            {dashboard.sections.map((section: any, index: number) => (
              <li key={index} className="sections__list-element">
                <Link className="sections__list-link" to={`${section.url}`}>{section.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      <Outlet/>
    </main>
  );
}