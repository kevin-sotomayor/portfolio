import { useLoaderData, redirect } from "react-router-dom";
import { json } from "@remix-run/node";

import { sessionCookie } from "../server/cookies.server";
import server from "../server/index.server";



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
  console.log(user);
  return (
    <main>
      <h2>Dashboard</h2>
      <h3>Bienvenue {user.username}</h3>
      <img src={user.image_url} alt={user.image_alt}/>
    </main>
  )
}