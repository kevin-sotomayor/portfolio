import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import Header from "./components/Header";

import resetcss from "./styles/reset.css";
import globals from "./styles/globals.css";
import header from "./styles/header.css";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: resetcss },
  { rel: "stylesheet", href: globals },
  { rel: "stylesheet", href: header },
];


export default function App() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header/>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
