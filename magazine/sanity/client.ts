import { createClient } from "next-sanity";

export const client = createClient({
    projectId: "cnro1amk",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});
