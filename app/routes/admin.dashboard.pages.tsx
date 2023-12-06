import { Outlet, Link, useLoaderData } from "@remix-run/react";

import dashboard from "../json/dashboard.json";
import navLinks from "../json/navLinks.json";
import e from "express";

const handleChange = (e: any) => {
  e.preventDefault();
  console.log(e.target.value);
}

export async function loader() {
  return navLinks;
}


export default function AdminDashboardPages() {
  const data = useLoaderData();
  console.log(data);
  return (
    <section className="dashboard-page__subsections">
      <label htmlFor="page">Quelle page allons-nous modifier ?</label>
      <select name="page" id="page" onChange={handleChange}>
        <option value="">-- Choisir une page --</option>
      {
        data && 
          data.map((link: any, index: number) => {
            return (
              <option key={index} value={link.name}>{link.title}</option>
            )
          })
      }
      </select>
      <form action="">
        {/* put in suspense because of the complexity of the task */}
        {/* TODO: this */}
      </form>
      <Outlet/>
    </section>
  )
}
