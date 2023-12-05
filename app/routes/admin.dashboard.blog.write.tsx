import { useLoaderData } from "@remix-run/react";

import server from "../server/index.server";
import { sessionCookie } from "../server/cookies.server";
import slugify from "../utils/slugify";


export async function loader({ request}: { request: Request}) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await sessionCookie.parse(cookieHeader)) || {};
  // Method to get the user id from the session id :
  const session = await server.controllers.session.getSessionId(cookie.sessionCookie);
  return session;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const formDataObject = {
    title: formData.get("title"),
    content: formData.get("content"),
    image_url: formData.get("image_url"),
    image_alt: formData.get("image_alt"),
    published: formData.get("published"),
    author_id: formData.get("author_id")
  }
  const result = await server.controllers.posts.createPost(formDataObject);
  return result;
}

export default function AdminDashboardBlogCreate() {
  const loader = useLoaderData();
  console.log(loader);
  return (
    <>
      <h4 className="subsections__title">Ecrire un article</h4>
      <form action="" className="blog-article__write-form" method="post">
        <input type="hidden" value={loader} name="author_id"/>
        <input type="text" name="title" placeholder="Titre de l'article" className="write-form__title"/>
        <textarea name="content" placeholder="Contenu de l'article" className="write-form__content"></textarea>
        <input type="text" name="image_url" placeholder="Lien de l'image de l'article" className="write-form__url"/>
        <input type="text" name="image_alt" placeholder="Alt de l'image de l'article" className="write-form__alt"/>
        <div className="write-form__state">
          <label htmlFor="published" className="state__label">Etat de l'article :</label>
          <select className="state__select" name="published" id="published">
            <option value="false">Non publié</option>
            <option value="true">Publié</option>
          </select>
        </div>
        <button className="write-form__submit" type="submit">Créer l'article</button>
      </form>
    </>
  )
}