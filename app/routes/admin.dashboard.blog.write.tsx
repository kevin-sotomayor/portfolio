export default function AdminDashboardBlogCreate() {
  // action logic
  return (
    <>
      <h4 className="subsections__title">Ecrire un article</h4>
      <form action="" className="blog-article__write-form">
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