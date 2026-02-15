import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/image";
// Import the base types from your auto-generated file
import { CustomImage, Slug } from "@/sanity/types";

// --- 1. DEFINE THE QUERY RESULT TYPE ---
// We define exactly what THIS query returns. 
// We reuse 'CustomImage' from your schema to keep it synced.
interface ArticlePageData {
    _id: string;
    title: string;
    malayalamTitle?: string;
    publishedAt?: string;
    // We reuse the strict CustomImage type from sanity.types.ts
    mainImage?: CustomImage;
    body?: any[];
    // GROQ transformed 'author' from a Reference to an Object, so we define that here
    author?: {
        name?: string;
        image?: CustomImage;
    };
    categories?: Array<{
        title?: string;
        slug?: Slug;
    }>;
    relatedSides?: Array<{
        title?: string;
        description?: string;
        showTitle?: boolean;
        image?: CustomImage;
    }>;
}

// --- 2. PORTABLE TEXT CONFIG ---
const ptComponents: PortableTextComponents = {
    types: {
        // Matches your schema name "customImage"
        customImage: ({ value }: { value: CustomImage }) => {
            // STRICT TYPING: TypeScript now knows 'value' is CustomImage
            // So 'value.file' is legally accessible
            if (!value?.file?.asset?._ref) return null;

            return (
                <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden">
                    <Image
                        src={urlFor(value.file).url()}
                        alt={value.alt || "Article Image"}
                        fill
                        className="object-cover"
                    />
                    {value.caption && (
                        <p className="text-center text-gray-500 text-sm mt-2">{value.caption}</p>
                    )}
                </div>
            );
        },
    },
    block: {
        h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-blue-900">{children}</h2>,
        h3: ({ children }) => <h3 className="text-2xl font-semibold mt-8 mb-3 text-blue-800">{children}</h3>,
        normal: ({ children }) => <p className="mb-4 leading-relaxed text-gray-800 text-lg break-all hyphens-auto text-pretty">{children}</p>,
    },
};

// --- 3. STATIC PARAMS ---
export async function generateStaticParams() {
    const articles = await client.fetch<{ _id: string }[]>(
        groq`*[_type == "article"]{ _id }`
    );
    return articles.map((article) => ({ id: article._id }));
}

// --- 4. PAGE COMPONENT ---
export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // This query matches the 'ArticlePageData' interface above
    const query = groq`*[_type == "article" && _id == $id][0]{
    _id,
    title,
    malayalamTitle,
    publishedAt,
    mainImage, 
    body,
    "author": author->{name, image},
    "categories": categories[]->{title, slug},
    "relatedSides": relatedSides[]->{
       title, 
       description, 
       showTitle,
       image 
    }
  }`;

    // We tell client.fetch to treat the result as 'ArticlePageData'
    const article = await client.fetch<ArticlePageData>(query, { id });

    if (!article) return notFound();

    return (
        <article className="min-h-screen bg-gray-50 pb-20">

            {/* Hero Image - STRICTLY TYPED CHECK */}
            {/* We check article.mainImage.file because CustomImage has 'file' inside it */}
            {article.mainImage?.file && (
                <div className="mb-12">
                    <div className="relative w-[100vw] -left-(--gutter-width) h-[240px] md:h-[300px] rounded-b-2xl overflow-hidden shadow-xl">
                        <Image
                            src={urlFor(article.mainImage.file).url()}
                            alt={article.mainImage.alt || article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            )}

            {/* Header */}
            <header className={
                `container mx-auto pb-6 text-center ${article.mainImage?.file ? "pt-10" : "pt-24"}`
            }>
                <div className="flex justify-center gap-2 mb-4">
                    {article.categories?.map((cat) => (
                        <span key={cat.slug?.current} className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {cat.title}
                        </span>
                    ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
                    {article.malayalamTitle}
                </h1>

                <div className="flex items-center justify-center gap-4 mt-8 text-gray-500 text-sm">
                    {article.author && (
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">By {article.author.name}</span>
                        </div>
                    )}
                    <span>•</span>
                    {article.publishedAt && (
                        <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>
                    )}
                </div>
            </header>

            {/* Content - Centered main content with sides on larger screens */}
            <div className="mx-auto">
                <div className="flex flex-col xl:flex-row xl:justify-center gap-12">

                    {/* Left Side - Hidden on smaller screens, shown on XL+ */}
                    <aside className="hidden xl:block xl:w-80  xl:top-4 xl:self-start space-y-8">
                        {article.relatedSides?.slice(0, Math.ceil((article.relatedSides.length) / 2)).map((side, index) => (
                            <div key={index} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                                {side.image?.file && (
                                    <>
                                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                                            <Image
                                                src={urlFor(side.image.file).url()}
                                                alt={side.title || "Side image"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="text-gray-600 leading-relaxed break-all hyphens-auto text-pretty">{side.image.caption}</p>
                                    </>
                                )}
                                {side.showTitle && (
                                    <h3 className="text-xl font-semibold text-gray-500 mb-2 break-all hyphen-auto text-center text-pretty">{side.title}</h3>
                                )}
                                <p className="text-gray-600 leading-relaxed break-all hyphen-auto text-left text-pretty">{side.description}</p>
                            </div>
                        ))}
                    </aside>

                    {/* Main Content - Always centered with max-w-3xl */}
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="prose prose-lg prose-blue max-w-none">
                            <PortableText value={article.body} components={ptComponents} />
                        </div>
                    </div>

                    {/* Right Side - Hidden on smaller screens, shown on XL+ */}
                    <aside className="hidden xl:block xl:w-80 xl:top-4 xl:self-start space-y-8">
                        {article.relatedSides?.slice(Math.ceil((article.relatedSides.length) / 2)).map((side, index) => (
                            <div key={index} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                                {side.image?.file && (
                                    <>
                                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                                            <Image
                                                src={urlFor(side.image.file).url()}
                                                alt={side.title || "Side image"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="text-gray-600 leading-relaxed break-all hyphens-auto text-pretty">{side.image.caption}</p>
                                    </>
                                )}
                                {side.showTitle && (
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 break-all hyphen-auto text-pretty">{side.title}</h3>
                                )}
                                <p className="text-gray-600 leading-relaxed break-all hyphen-auto text-pretty">{side.description}</p>
                            </div>
                        ))}
                    </aside>
                </div>

                {/* Bottom Sides - Shown on smaller screens (below XL) */}
                <div className="xl:hidden mt-12 max-w-3xl mx-auto space-y-8">
                    {article.relatedSides?.map((side, index) => (
                        <div key={index} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                            {side.image?.file && (
                                <>
                                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                                        <Image
                                            src={urlFor(side.image.file).url()}
                                            alt={side.title || "Side image"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="text-gray-600 leading-relaxed break-all hyphens-auto text-pretty">{side.image.caption}</p>
                                </>
                            )}
                            {side.showTitle && (
                                <h3 className="text-xl font-bold text-gray-800 mb-2 break-all hyphen-auto text-pretty">{side.title}</h3>
                            )}
                            <p className="text-gray-600 leading-relaxed break-all hyphen-auto text-pretty">{side.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}