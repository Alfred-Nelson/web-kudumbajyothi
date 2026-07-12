"use server";

import Link from "next/link";
import { LayoutPropsType } from "@/sanity/general_types";
import { MotionContainer, MotionItem } from "./Animations";

export default async function Layout5<T>(props: LayoutPropsType<T>) {
    const items = props.items.slice(0, 4); // limit to 4 like TIME
    const title = props.title;

    if (!items?.length) return null;

    return (
        <section className="bg-warm-grey-3 py-10 lg:py-16 text-black-coffee">

            {/* HEADER */}
            <div className="container mx-auto max-w-360 px-(--gutter-width)">
                <div className="mb-8 flex flex-col items-center justify-between border-b border-warm-grey-2 lg:flex-row lg:items-end">

                    {title && (
                        <h2 className="text-center lg:text-left text-4xl lg:text-6xl font-family-uroob font-bold">
                            {title}
                        </h2>
                    )}

                    {/* OPTIONAL READ MORE */}
                    {/* <Link
                        href="#"
                        className="mt-4 lg:mt-0 text-sm uppercase hover:text-primary transition-colors"
                    >
                        Read More →
                    </Link> */}

                </div>
            </div>

            {/* GRID */}
            <div className="container mx-auto max-w-360 px-(--gutter-width)">

                <MotionContainer className="grid grid-cols-4 lg:grid-cols-12 gap-4">

                    {items.map((item, i) => (
                        <MotionItem
                            key={i}
                            type="bottom"
                            index={i}
                            className="col-span-full lg:col-span-3"
                        >
                            <VoiceCard {...props} item={item} />
                        </MotionItem>
                    ))}

                </MotionContainer>

            </div>
        </section>
    );
}

/* ---------------- CARD ---------------- */

function VoiceCard<T>(props: LayoutPropsType<T> & { item: T }) {
    const item = props.item;

    const link = props.link(item);
    const heading = props.heading(item);
    const subDescription = props.subDescription?.(item);

    return (
        <Link href={link ?? "#"} className="group block h-full">
            <article className="relative flex flex-col justify-between space-y-5 bg-white p-6 lg:p-8 min-h-56 h-full rounded-xl">

                {/* TITLE */}
                <h3 className="font-family-uroob text-3xl lg:text-5xl leading-11 transition-colors duration-300 group-hover:text-primary">
                    {heading}
                </h3>

                {/* AUTHOR / META */}
                {subDescription && (
                    <p className="text-lg text-gray-500 font-medium">
                        {subDescription}
                    </p>
                )}

            </article>
        </Link>
    );
}