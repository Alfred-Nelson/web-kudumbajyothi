import { notFound } from "next/navigation";
import APIS from "@/sanity/api";
import SanityImage from "@/app/components/SanityImage";
import { RegularArticleList } from "./RegularArticleList";

export default async function RegularPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const regular = await APIS.getRegularBySlug(slug);
    if (!regular) notFound();

    return (
        <main className="min-h-screen">

            {/* HEADER */}
            <div className="relative pt-32 pb-16 px-(--gutter-width) overflow-hidden bg-black">

                {/* BACKGROUND IMAGE MODE */}
                {regular.coverImage?.placement === "background" && (
                    <>
                        <div className="absolute inset-0">
                            <SanityImage
                                image={regular.coverImage}
                                width={1600}
                                className="object-cover!"
                            />
                        </div>

                        {/* DARK OVERLAY */}
                        <div className="absolute inset-0 bg-black/60" />
                    </>
                )}

                <div className="relative mx-auto flex flex-col lg:flex-row items-center gap-10">

                    {/* SIDE IMAGE MODE */}
                    {regular.coverImage?.placement !== "background" && (
                        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">

                            <div className="relative w-full max-w-sm lg:max-w-md aspect-4/5 max-h-[500px] overflow-hidden rounded-2xl shrink-0">
                                <SanityImage
                                    image={regular.coverImage}
                                    width={600}
                                />
                            </div>

                        </div>
                    )}

                    {/* TEXT */}
                    <div className={`space-y-6 text-center lg:text-left text-white self-stretch flex flex-col justify-end`}>
                        <h1 className="font-family-uroob text-4xl md:text-6xl lg:text-5xl">
                            {regular.malayalamTitle}
                        </h1>

                        {regular.description && (
                            <p className={`font-family-malini text-base md:text-lg lg:text-lg max-w-3xl text-white/90`}>
                                {regular.description}
                            </p>
                        )}

                        <p className={`text-sm text-white/70`}>
                            {regular.parts?.length || 0} ലേഖനങ്ങൾ
                        </p>
                    </div>
                </div>
            </div>

            {/* ARTICLES */}
            <section className="px-(--gutter-width) py-16">
                <RegularArticleList articles={regular.parts || []} />
            </section>

        </main>
    );
}