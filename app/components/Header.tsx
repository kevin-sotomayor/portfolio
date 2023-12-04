import { Link } from "@remix-run/react";

import navLinks from "../json/navLinks.json";


const asideMenuHandler = () => {
  const sidemenu = document.querySelector('.header__sidemenu');
  const sidemenuButton = document.querySelector('.header__sidemenu-button');
  if (sidemenu !== null && sidemenuButton !== null) {
    sidemenu.classList.contains('active') ? sidemenu.classList.remove('active') : sidemenu.classList.add('active');
    sidemenu.classList.contains('active') ? sidemenuButton.classList.add('hidden') : sidemenuButton.classList.remove('hidden');
  }
}

export default function Header() {
  return (
    <header className='header'> 
      <button onClick={asideMenuHandler} className='header__sidemenu-button'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div className='header__logo-container'>
        <Link to="/" prefetch="viewport" className="header__logo-link">
          <h1 className='header__logo-element'>Mon portfolio</h1>
        </Link>
      </div>
      <aside className="header__sidemenu">
        <button onClick={asideMenuHandler} className="header__sidemenu-exit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav className="header__sidemenu-nav">
          <ul className="header__sidemenu-list">
            {navLinks.map((link, index) => (
              <li key={index} className="header__sidemenu-item">
                <Link to={link.url} className="header__sidemenu-link" onClick={asideMenuHandler} prefetch="viewport">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
          <form action="" className="header__sidemenu-searchbar">
            <input type="text" className="header__sidemenu-input" placeholder="Votre recherche"/>
            <button className="header__sidemenu-submit">Rechercher</button>
          </form>
        </nav>
        <section className="header__sidemenu-social">
          <ul>
            <li>Linkedin</li>
            <li>Github</li>
          </ul>
        </section>
      </aside>
    </header>
  )
}
