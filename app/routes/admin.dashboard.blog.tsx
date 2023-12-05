import { Outlet, Link } from "@remix-run/react";

import dashboard from "../json/dashboard.json";


export default function AdminDashboardBlog() {
  const section: any = dashboard.sections[0];
  console.log(section);
  return (
    <section className="dashboard-page__subsections">
      <nav className="subsections__nav">
        <ul className="subsections__list">
          {
            section?.subsections.map((subsection: any, index: number) => (
              <li key={index} className="subsections__list-element">
                <Link to={`${subsection.url}`} className="subsections__list-link">{subsection.name}</Link>
              </li>
            ))
          }
        </ul>
      </nav>
      <Outlet/>
    </section>
  )
}
