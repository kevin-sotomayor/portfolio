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
  const arrayOfStarsProps = [];
  const numberOfStars = Math.floor(Math.random() * 100) + 100;
  for (let i = 0; i < numberOfStars; i++) {
    let starProps = {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      size: Math.floor(Math.random() * 3) + 1,
      // color: Math.floor(Math.random() * 3) + 1,
    }
    arrayOfStarsProps.push(starProps);
  }
  return arrayOfStarsProps;
}


export default function Index() {
  const data = useLoaderData();
  console.log(data);
  return (
    <main className="homepage">
      <section className="homepage__night">
        <div className="night__container">
        {
          data.map((star, index) => {
            return (
              <div
                key={index}
                className="star"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  // backgroundColor: `${star.color}`,
                }}
              ></div>
            )
          })
        }
        </div>
      </section>
      <section className="homepage__dawn">

      </section>
      <section className="homepage__sun"></section>
      <section className="homepage__day"></section>
    </main>
  )
}
