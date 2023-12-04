import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";


const body = document.querySelector('body');
const sidemenu = document.querySelector('.header__sidemenu');
const sidemenuButton = document.querySelector('.header__sidemenu-button');
if (body) {
  body.addEventListener("click", (event) => {
    if (sidemenu && sidemenuButton) {
      if (sidemenu.classList.contains('active') && !sidemenu.contains(event.target as Node)) {
        sidemenu.classList.remove('active');
        sidemenuButton.classList.remove('hidden');
      }
    } 
  });
}


startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
