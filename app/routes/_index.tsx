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
  const arrayOfCloudsProps = [];
  const numberOfStars = Math.floor(Math.random() * 50) + 200;
  const numberOfClouds = Math.floor(Math.random() * 5) + 30;
  for (let i = 0; i < numberOfStars; i++) {
    let starProps = {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 133),
      size: Math.floor(Math.random() * 3) + 1,
      // color: Math.floor(Math.random() * 3) + 1, // TODO: add various colors
    }
    arrayOfStarsProps.push(starProps);
  }
  for (let i = 0; i < numberOfClouds; i++) {
    const rng = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    let cloudProps = {
      x: rng(-100, 150), 
      y: rng(-50, 20),
      width: rng(25, 100),
      height: rng(15, 30),
      seed: rng(0, 10000),
    }
    arrayOfCloudsProps.push(cloudProps);
  }
  const data = {
    stars: arrayOfStarsProps,
    clouds: arrayOfCloudsProps,
  }
  return data;
}


export default function Index() {
  const data = useLoaderData();
  console.log(data);
  return (
    <main className="homepage">
      <section className="homepage__night">
        <div className="stars__container">
        {
          data.stars.map((star, index) => {
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
        <div className="night__content">
          <h2 className="night__title">Bienvenue</h2>
        </div>
      </section>
      <section className="homepage__dawn">
        <div className="dawn__content">
          <h4 className="dawn__title">Je m'appelle Kevin et je suis développeur web.</h4>
          <p className="dawn__text">Cette page est pûrement esthétique. Vous trouverez toutes les informations de navigation dans le menu accessible en cliquant sur l'icône en haut à gauche de votre écran.</p>
        </div>
      </section>
      <section className="homepage__sun"></section>
      <section className="homepage__day">
        <div className="clouds__container">
          {
            data.clouds.map((cloud, index) => {
              return (
                <div key={index}>
                  <div className="cloud" id="cloud-back" style={{
                    left: `${cloud.x}%`,
                    top: `${cloud.y}%`,
                    width: `${cloud.width}rem`,
                    height: `${cloud.height}rem`,
                  }}></div>
                  <div className="cloud" id="cloud-mid" style={{
                    left: `${cloud.x}%`,
                    top: `${cloud.y}%`,
                    width: `${cloud.width}rem`,
                    height: `${cloud.height}rem`,
                  }}></div>
                  <div className="cloud" id="cloud-front" style={{
                    left: `${cloud.x}%`,
                    top: `${cloud.y}%`,
                    width: `${cloud.width}rem`,
                    height: `${cloud.height}rem`,
                  }}></div>    
                  <svg width="0" height="0"> 
                    <filter id="filter-back">
                      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed={`${cloud.seed}`} />     
                      <feDisplacementMap  in="SourceGraphic" scale="170" />
                    </filter>
                    <filter id="filter-mid">
                      <feTurbulence type="fractalNoise"  baseFrequency="0.012" numOctaves="2" seed={`${cloud.seed}`}/>
                      <feDisplacementMap  in="SourceGraphic" scale="150" />
                    </filter>
                    <filter id="filter-front">
                      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed={`${cloud.seed}`}/>
                      <feDisplacementMap  in="SourceGraphic" scale="100" />
                    </filter>
                  </svg>
                </div>
              )
            })
          }
        </div>
        <div className="day__content">
          <p className="day__text">L'intégralité des éléments sur cette page est généré avec du code JavaScript, du CSS et des balises HTML.</p>
          <p className="day__text">Vous pouvez rafraichir la page et vous remarquerez que les éléments animés en arrière-plan se rechrgent.</p>
        </div>
      </section>
    </main>
  )
}
