import type { LinksFunction } from "@remix-run/node"
import { useLoaderData } from "react-router-dom";
import { json } from "@remix-run/node";
import { redirect } from "react-router-dom";

import { sessionCookie } from "../server/cookies.server";
import server from "../server/index.server";


export async function loader ({ request }: { request: Request}) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await sessionCookie.parse(cookieHeader)) || {};
  if (cookie.sessionCookie) {
    const user = await server.controllers.session.verifySession(cookie)
    if (!user) {
      return redirect("/admin/login");
    }
    return (user);
  }
  if (!cookie.sessionCookie) {
    // TODO: Modal to say "You need to login to access this page" then redirect to login page:
    return redirect("/admin/login");
  }
}

export default function AdminDashboard() {
  const user: any = useLoaderData();
  console.log(user);
  return (
    <main>
      <h2>Dashboard</h2>
      <h3>Sup {user.username} 🙂</h3>
      {/* TODO: blog post manager */}
    </main>
  )
}