import { useLoaderData, Link, useMatches } from "@remix-run/react";
import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

import globals from "../styles/globals.css";
import article from "../styles/article.css";

import formatDate from "../utils/formatDate";
import PreviousButton from "../components/icons/PreviousButton";

// TODO: meta content is interactive (title, description, image, etc.)
export const meta: MetaFunction = () => {
  return [
    { title: ""},
    { name: "description", content: "" },
  ];
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globals },
    { rel: "stylesheet", href: article },
  ];
}

const prisma = new PrismaClient();

interface BlogParamsInterface {
  slug: string;
}

interface BlogArticleInterface {
  id: number;
  title: string;
  content: string;
  published: boolean;
  image_url: string;
  created_at: string;
  author: {
    username: string;
  }
}

export async function loader({ params } : { params: BlogParamsInterface }) {
  const slug: string = params.slug;
  try {
    const result = await prisma.post.findUnique({
      where: {
        url: slug
      },
      include: {
        author: {
          select: {
            username: true,
          }
        }
      }
    });
    return result;
  }
  catch (error) {
    console.log(error);
  }
} 

export default function Article() {
  const matches = useMatches();
  // console.log(matches);
  const article: BlogArticleInterface = useLoaderData();
  return (
    <main className="article-page">
      {article && article.published && (
        <>
          <Link className="article-page__button" to="/blog" prefetch="viewport">
            Retour
            <PreviousButton />
          </Link>
          <h2 className="article-page__title">{article.title}</h2>
          <p className="article-page__author">{article.author.username}</p>
          <h3 className="article-page__date">{formatDate(article.created_at)}</h3>
          <img className="article-page__image" src={article.image_url} alt="" />
          <p className="article-page__content">{article.content}</p>
        </>
      )}
      {(!article || !article.published) && (
        <>
          <h2 className="article-page__error">Cet article n'existe pas</h2>
          <Link className="article-page__button" to="/blog" prefetch="viewport">
            Retour à la page précédente
          </Link>
        </>
      )}
    </main>
  );
}