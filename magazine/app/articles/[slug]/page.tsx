import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import APIS from "@/sanity/api";
import { PortableText } from "@portabletext/react";
import SanityImage from "@/app/components/SanityImage";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export async function generateStaticParams() {
    const articles = await client.fetch<{ slug: { current: string } }[]>(
        groq`*[_type == "article"]{ slug }`
    );

    return articles.map((a) => ({
        slug: a.slug.current
    }));
}

export default async function ArticlePage({ params }: any) {
    const { slug } = await params;
    const article = await APIS.getArticle(slug);

    if (!article) return null;

    // --------------------------------------------
    // LINK CARDS (Single Object Pattern)
    // --------------------------------------------
    const LinkCard = {
        Author: ({ author }: any) => (
            <Link href={`/authors/${author.slug.current}`}>
                <div className="group flex items-center gap-4 p-4 border rounded-xl hover:bg-muted transition">
                    <div className="w-14 h-14 relative rounded-full overflow-hidden">
                        <SanityImage image={author.image} />
                    </div>
                    <p className="flex-1 font-medium">{author.malayalamName}</p>
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition" />
                </div>
            </Link>
        ),

        Collection: ({ collection }: any) => (
            <Link href={`/collections/${collection.slug.current}`}>
                <div className="group p-4 border rounded-xl hover:bg-muted transition">
                    <p className="font-semibold">{collection.malayalamTitle}</p>
                </div>
            </Link>
        ),

        Regular: ({ regular }: any) => (
            <Link href={`/regulars/${regular.slug.current}`}>
                <div className="group flex items-center gap-4 p-4 border rounded-xl hover:bg-muted transition">
                    {regular.coverImage && (
                        <div className="w-16 h-20 relative rounded-lg overflow-hidden">
                            <SanityImage image={regular.coverImage} />
                        </div>
                    )}
                    <p className="font-medium">{regular.malayalamTitle}</p>
                </div>
            </Link>
        )
    };

    // --------------------------------------------
    // INLINE GROUPING LOGIC (NO EXTRA FILE)
    // --------------------------------------------
    const groupedContent: any[] = [];

    for (let i = 0; i < (article.contentLayout || []).length; i++) {
        const item = article.contentLayout[i];

        if (item._type === "reference" && item._refType === "side") {
            const group = [item];
            let j = i + 1;

            while (
                j < article.contentLayout.length &&
                article.contentLayout[j]._type === "reference" &&
                article.contentLayout[j]._refType === "side"
            ) {
                group.push(article.contentLayout[j]);
                j++;
            }

            groupedContent.push({
                type: "sideGroup",
                items: group,
                key: item._key
            });

            i = j - 1;
        } else {
            groupedContent.push(item);
        }
    }

    return (
        <article className="min-h-screen pb-20 font-family-malini text-lg">

            {/* HEADER */}
            <div className="relative w-full overflow-hidden bg-black">

                {article?.mainImage?.placement === "background" && (
                    <>
                        <div className="absolute inset-0">
                            <SanityImage image={article.mainImage} width={1920} />
                        </div>
                        <div className="absolute inset-0 bg-black/60" />
                    </>
                )}

                <div className="relative flex flex-col lg:flex-row items-end gap-8 px-(--gutter-width) py-20">

                    {article?.mainImage?.placement !== "background" && (
                        <div className="w-full lg:w-1/3">
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                                <SanityImage image={article.mainImage} width={600} />
                            </div>
                        </div>
                    )}

                    <div className="text-white max-w-3xl">
                        <h1 className="text-5xl font-bold">{article.malayalamTitle}</h1>
                        <p className="mt-3">{article.description}</p>
                        <div className="mt-4">—— {article.author?.malayalamName}</div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="mt-12">

                {groupedContent.map((block: any) => {

                    // ---------------- TEXT ----------------
                    if (block._type === "block") {
                        return (
                            <div key={block._key} className="max-w-2xl mx-auto px-(--gutter-width)">
                                <PortableText value={[block]} />
                            </div>
                        );
                    }

                    // ---------------- SIDE GROUP ----------------
                    if (block.type === "sideGroup") {
                        const group = block.items;
                        const isCollage = group.length > 1;

                        return (
                            <div key={block.key} className="w-full my-12">
                                <div className="max-w-2xl mx-auto px-(--gutter-width)">
                                    <div className="bg-muted/40 border rounded-2xl p-6 space-y-4">

                                        {group[0].showTitle && (
                                            <h4 className="text-xl font-semibold">
                                                {group[0].title}
                                            </h4>
                                        )}

                                        {isCollage ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {group.map((s: any) =>
                                                    s.image && (
                                                        <div key={s._id} className="relative aspect-square rounded-lg overflow-hidden">
                                                            <SanityImage image={s.image} />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            group[0].image && (
                                                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                                                    <SanityImage image={group[0].image} />
                                                </div>
                                            )
                                        )}

                                        {group.map((s: any) =>
                                            s.description && (
                                                <p key={s._id}>{s.description}</p>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>

            {/* LINKS */}
            <div className="max-w-3xl mx-auto mt-20 space-y-10 px-(--gutter-width)">

                <div>
                    <p className="text-xs uppercase text-muted-foreground mb-3">Author</p>
                    <LinkCard.Author author={article.author} />
                </div>

                {article.collections?.length > 0 && (
                    <div>
                        <p className="text-xs uppercase text-muted-foreground mb-3">Collections</p>
                        <div className="space-y-3">
                            {article.collections.map((c: any) => (
                                <LinkCard.Collection key={c._id} collection={c} />
                            ))}
                        </div>
                    </div>
                )}

                {article.series && (
                    <div>
                        <p className="text-xs uppercase text-muted-foreground mb-3">Series</p>
                        <LinkCard.Regular regular={article.series} />
                    </div>
                )}
            </div>

        </article>
    );
}