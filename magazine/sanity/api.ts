import { defineQuery } from "next-sanity";
import { client } from "./client";

export const CONFIG = defineQuery(`
  *[_type == "settings"][0]{
    sections[]{
      ...,
      // --------------------------------
      // COLLECTION SECTION
      // --------------------------------
      _type == "collectionSection" => {
        ...,

        collection->{
          ...,
          "curatedCount": count(articles),
          "articles": null,
          "contentLayout": null,
          layoutArticles[]->{
            ...,
  
            author->{
              ...,
            }
          }
        }
      },
  
      // --------------------------------
      // AUTHORS SECTION
      // --------------------------------
      _type == "authorsSection" => {
        ...,
  
        authors[]->{
          ...,
        }
      },
  
      // --------------------------------
      // REGULARS SECTION
      // --------------------------------
      _type == "regularsSection" => {
        ...,
  
        regulars[]->{
          ...,
        }
      },
  
      // --------------------------------
      // AD SECTION
      // --------------------------------
      _type == "advertisementSection" => {
        ...
      }
  
    }
  }
  `)


export const ARTICLE = defineQuery(`
    *[_type == "article" && slug.current == $slug][0]{
      ...,
    
      author->{
        _id,
        malayalamName,
        slug,
        image
      },
    
      series->{
        _id,
        malayalamTitle,
        slug,
        coverImage
      },
    
      contentLayout[]{
        ...,
        _type == "reference" => {
          ...@->,
          "_refType": _type
        }
      },
    
      "collections": *[
        _type == "collection" &&
        references(^._id)
      ]{
        _id,
        malayalamTitle,
        slug
      }
    }
    `);

// "curatedArticles": articles[]->{
//     _id,
//     title,
//     malayalamTitle,
//     "slug": slug.current
//   }

const AUTHORS = defineQuery(`
    *[_type == "author"] | order(orderRank asc){
      ...
    }
  `)

const AUTHORS_PAGINATED = defineQuery(`
    *[_type == "author"] | order(orderRank asc)[$start...$end] {
      ...,
      "slug": slug.current
    }
`);

export const ARTICLES_BY_AUTHOR_PAGINATED = defineQuery(`
  *[_type == "article" && author._ref == $authorId] | order(publishedAt desc)[$start...$end] {
    _id,
    malayalamTitle,
    description,
    mainImage,
    "slug": slug.current,
    publishedAt
  }
`);

export const AUTHOR_BY_SLUG = defineQuery(`
  *[_type == "author" && slug.current == $slug][0] {
    ...,
    "slug": slug.current
  }
`);


export const AUTHORS_SEARCH = defineQuery(`
  *[_type == "author" && (name match $searchTerm || malayalamName match $searchTerm || bio match $searchTerm)] 
  | order(orderRank asc)[$start...$end] {
    ...,
    "slug": slug.current
  }
`);

export const ARTICLES_BY_AUTHOR_SEARCH = `
    *[_type == "article" && author._ref == $authorId && (
      title match $searchTerm || 
      slug match $searchTerm ||
      malayalamTitle match $searchTerm || 
      description match $searchTerm ||
      tags[] match $searchTerm ||
      series->title match $searchTerm ||
      series->malayalamTitle match $searchTerm
    )] | order(publishedAt desc)[$start...$end] {
      ...
    }
`;


export const ARTICLES_SEARCH = defineQuery(`
  *[_type == "article" && 
    (searchTerm == "*" || (
      title match $searchTerm || 
      malayalamTitle match $searchTerm || 
      description match $searchTerm || 
      tags[] match $searchTerm || 
      categories[]->title match $searchTerm || 
      author->name match $searchTerm || 
      author->malayalamName match $searchTerm
    )) &&
    ($year == "" || publishedAt match $year + "*")
  ] | order(publishedAt desc) [$start...$end] {
    ...,
    "slug": slug.current,
    author-> { name, malayalamName }
  }
`);

export const UNIQUE_YEARS = defineQuery(`
  *[_type == "article" && defined(publishedAt)] | order(publishedAt desc).publishedAt
`);

export const REGULARS_SEARCH = defineQuery(`
  *[_type == "regular" && (title match $searchTerm || malayalamTitle match $searchTerm)]
  | order(_createdAt desc)[$start...$end]{
    ...,
    "slug": slug.current,

    // count of articles
    "articlesCount": count(parts),

    // preview articles (first 3)
    parts[0...3]->{
      title,
      malayalamTitle,
      "slug": slug.current,

      author->{
        malayalamName,
        name
      }
    }
  }
`)

// GROQ
export const REGULAR_BY_SLUG = defineQuery(`
  *[_type == "regular" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    parts[]->{
      ...,
      "slug": slug.current,
      author->{
        malayalamName,
        name
      }
    }
  }
`);

const QUERIES = {
  CONFIG,
  ARTICLE,
  AUTHORS,
  AUTHORS_PAGINATED,
  ARTICLES_BY_AUTHOR_PAGINATED,
  AUTHOR_BY_SLUG,
  AUTHORS_SEARCH,
  ARTICLES_BY_AUTHOR_SEARCH,
  ARTICLES_SEARCH,
  UNIQUE_YEARS,
  REGULARS_SEARCH,
  REGULAR_BY_SLUG,
}

const APIS = {
  async getConfig() {
    try {
      const config = await client.fetch(QUERIES.CONFIG)
      return config
    } catch (error) {
      console.error("Error fetching config:", error)
      return []
    }
  },


  async getArticle(slug: string) {
    if (!slug) {
      console.error("getArticle was called without a slug");
      return null;
    }

    try {
      const article = await client.fetch(QUERIES.ARTICLE, { slug: slug })
      return article
    } catch (error) {
      console.error("Error fetching article: ", error)
      return null
    }
  },

  async getAuthors() {
    try {
      const authors = await client.fetch(QUERIES.AUTHORS)
      return authors
    } catch (error) {
      console.error("Error fetching authors: ", error)
      return null
    }
  },

  async getAuthorsPaginated(start: number = 0, limit: number = 10) {
    try {
      const authors = await client.fetch(QUERIES.AUTHORS_PAGINATED, {
        start,
        end: start + limit,
      });
      return authors;
    } catch (error) {
      console.error("Error fetching authors: ", error);
      return [];
    }
  },

  async getAuthorBySlug(slug: string) {
    return await client.fetch(QUERIES.AUTHOR_BY_SLUG, { slug });
  },

  async getArticlesByAuthor(authorId: string, start: number = 0, limit: number = 9) {
    return await client.fetch(QUERIES.ARTICLES_BY_AUTHOR_PAGINATED, {
      authorId,
      start,
      end: start + limit
    });
  },

  async searchAuthors(searchTerm: string = "*", start: number = 0, limit: number = 10) {
    return await client.fetch(QUERIES.AUTHORS_SEARCH, {
      searchTerm: searchTerm === "" ? "*" : `*${searchTerm}*`,
      start,
      end: start + limit
    });
  },

  async getArticlesByAuthorSearch(authorId: string, query: string, start: number, limit: number) {
    const processedSearchTerm = query ? `${query}*` : "*";

    return await client.fetch(ARTICLES_BY_AUTHOR_SEARCH, {
      authorId,
      searchTerm: processedSearchTerm,
      start,
      end: start + limit
    });
  },

  async searchArticles(searchTerm: string = "*", start: number = 0, limit: number = 12, year: string = "") {
    return await client.fetch(QUERIES.ARTICLES_SEARCH, {
      searchTerm: searchTerm === "" || searchTerm === "*" ? "*" : `*${searchTerm}*`,
      start,
      end: start + limit,
      year
    });
  },

  async getUniqueYears() {
    const dates: string[] = await client.fetch(QUERIES.UNIQUE_YEARS);
    if (!dates || !Array.isArray(dates)) return [];

    // Extract YYYY, remove duplicates, and sort descending
    return Array.from(new Set(dates.map(d => d.slice(0, 4))))
      .sort((a, b) => b.localeCompare(a));
  },

  async searchRegulars(searchTerm: string = "*", start: number = 0, limit: number = 10) {
    return await client.fetch(QUERIES.REGULARS_SEARCH, {
      searchTerm: searchTerm === "" ? "*" : `*${searchTerm}*`,
      start,
      end: start + limit
    });
  },


  async getRegularBySlug(slug: string) {
    return client.fetch(QUERIES.REGULAR_BY_SLUG, { slug });
  },
}

export default APIS