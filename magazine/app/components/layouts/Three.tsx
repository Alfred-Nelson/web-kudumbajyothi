"use server";

import Link from "next/link";
import { MotionContainer, MotionItem } from "./Animations";
import { LayoutPropsType } from "@/sanity/general_types";
import SanityImage from "../SanityImage";

export default async function Layout3<T>(props: LayoutPropsType<T>) {
    const { items, title } = props;

    if (!items?.length) return null;

    return (
        <section className="bg-warm-grey-3 text-black-coffee">

            {/* HEADER */}
            <div className="mx-auto max-w-360 px-(--gutter-width)">
                {title && (<div className="mb-8 border-b-[0.5] border-warm-grey-2 lg:mb-10">

                    <h2 className="pb-4 text-center font-family-uroob font-bold tracking-[0.02em] text-4xl lg:pb-0 lg:text-left lg:text-7xl">
                        {title}
                    </h2>

                </div>)}
            </div>

            {/* GRID */}
            <div className="mx-auto max-w-360 px-(--gutter-width) pb-10">
                <MotionContainer amount={0.4} className="grid grid-cols-4 lg:grid-cols-12 gap-x-4 gap-y-6 lg:gap-y-0">
                    {items.slice(0, 4).map((item, i) => (
                        <MotionItem
                            key={i}
                            type="grid"
                            index={i}
                            className="col-span-full lg:col-span-3"
                        >
                            <Card {...props} item={item} />
                        </MotionItem>
                    ))}

                </MotionContainer>
            </div>
        </section>
    );
}

/* ---------------- CARD ---------------- */

function Card<T>(props: LayoutPropsType<T> & { item: T }) {
    const item = props.item;

    const link = props.link(item);
    const image = props.image?.(item);
    const heading = props.heading(item);
    const description = props.description?.(item);
    const subDescription = props.subDescription?.(item);

    return (
        <Link href={link ?? "#"} className="group block">
            <article className="relative space-y-3 text-center">

                {/* IMAGE */}
                {!!image && (
                    <figure>
                        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
                            <SanityImage
                                image={image}
                                width={800}
                                sizes="(max-width:1024px) 95vw, (max-width:1440px) 22vw, 300px"
                                className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            />
                        </div>
                    </figure>
                )}

                {/* TITLE */}
                <h3 className="font-family-uroob tracking-[0.02em] text-5xl leading-10 transition-colors duration-300 group-hover:text-primary">
                    {heading}
                </h3>

                {!!description && (
                    <p className="">
                        {description}
                    </p>
                )}

                {subDescription && (
                    <p className=" text-lg mt-4">
                        {subDescription}
                    </p>
                )}

            </article>
        </Link>
    );
}