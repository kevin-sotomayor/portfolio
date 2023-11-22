import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import blog from "../styles/blog.css";

import formatDate from "../utils/formatDate";
import server from "../server/index.server"


// Truncate content to a given number of words :
const truncateContent = (content: string, maxWords: number) : string => {
  const words = content.split(' ');
  if (words.length > maxWords) {
    const truncatedWords = words.slice(0, maxWords);
    const lastWordIndex = truncatedWords.length - 1;
    if (words[lastWordIndex].endsWith('.') || words[lastWordIndex].endsWith(',')) {
      truncatedWords[lastWordIndex] = truncatedWords[lastWordIndex].slice(0, -1);
    }
    return truncatedWords.join(' ') + '...';
  }
  return content;
}


export const meta: MetaFunction = () => {
  return [
    { title: "Blog du portfolio" },
    { name: "description", content: "Mes articles de blog" },
  ];
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: blog }
  ];
}

export async function loader() {
  try {
    const test = server.controllers.posts.getAllPosts();
    return test;
  }
  catch (error) {
    console.log(error);
  }
}

// TODO: Typing

export default function Blog() {
  const articles: any = useLoaderData();
  
  return (
    <main className="blog-page">
      <h2 className="blog-page__title">Blog</h2>
      {
        articles ? articles.map((article: any) => {
          const truncatedContent = truncateContent(article.content, 50); // Makes a preview of the article
          return (
            <article key={article.id} className="blog-page__article article">
              <h3 className="article__title">{article.title}</h3>
              <h3 className="article__author">Écrit par : {article.author.username}</h3>
              <p className="article__date">{formatDate(article.created_at)}</p>
              <img className="article__image" src={article.image_url} alt="none" loading="lazy"/>
              <p className="article__content">{truncatedContent}</p>
              {/* TODO: add url to article */}
              <Link className="article__button" to={article.url}>Lire la suite</Link>
            </article>
          );
        }) : <h3 className="blog-page__error">Aucun article trouvé...</h3>
      } 
    </main>
  );
}
