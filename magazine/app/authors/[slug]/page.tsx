import { notFound } from "next/navigation";
import APIS from "@/sanity/api";
import { AuthorArticleSearchList } from "./AuthorArticleSearchList";
import SanityImage from "@/app/components/SanityImage";

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const author = await APIS.getAuthorBySlug(slug);

    if (!author) notFound();

    // Initial fetch for the grid (12 items for 3-col grid)
    const initialArticles = await APIS.getArticlesByAuthorSearch(author._id, "*", 0, 12);

    return (
        <main className="min-h-screen bg-white">
            {/* AUTHOR HEADER */}
            <header className="bg-black/95 pt-32 pb-12 px-(--gutter-width) text-white">
                <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl">
                    <div className="relative size-40 md:size-56 shrink-0 overflow-hidden rounded-full border-4 border-white/10">
                        <SanityImage image={author.profileImage} width={400} />
                    </div>
                    <div className="text-center md:text-left space-y-4">
                        <h1 className="font-family-uroob text-6xl md:text-8xl">
                            {author.malayalamName || author.name}
                        </h1>
                        {author.bio && (
                            <p className="font-family-malini text-xl text-white/80 max-w-2xl text-pretty">
                                {author.bio}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            {/* SEARCH & PAGINATED GRID */}
            <section className="px-(--gutter-width) py-16">
                <AuthorArticleSearchList
                    initialArticles={initialArticles || []}
                    authorId={author._id}
                />
            </section>
        </main>
    );
}