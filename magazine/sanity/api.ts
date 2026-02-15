import { groq } from "next-sanity";
import { client } from "./client";
import { Collection } from "./types";

const COLLECTIONS = groq`*[_type == "collection"] {
  _id,
  title,
  slug,
  description,
  "articles": articles[]->{
    _id,
    title,
    malayalamTitle,
    description,
    slug,
    mainImage
  }
}`;

const QUERIES = {
    COLLECTIONS,
}

const APIS = {
    async getCollections() {
        try {
            const collections: Collection[] = await client.fetch(QUERIES.COLLECTIONS)
            return collections
        } catch (error) {
            console.error("Error fetching collections:", error)
            return []
        }
    }
}

export default APIS