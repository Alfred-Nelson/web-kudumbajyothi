"use server";

import Link from "next/link";
import { MotionContainer, MotionItem } from "./Animations";
import { LayoutPropsType } from "@/sanity/general_types";
import SanityImage from "../SanityImage";

export default async function Layout2<T>(props: LayoutPropsType<T>) {
    const main = props.items[0];
    const bottom = props.items.slice(1, 5);
    const title = props.title

    if (!main) return null;

    return (
        <section className="relative flex-col pb-10 lg:py-10">

            {/* HEADER */}
            <div className="mx-auto max-w-360 px-(--gutter-width)">
                {title && (<div className="mb-8 border-b-[0.5] border-warm-grey-2 lg:mb-10">

                    <h2 className="pb-4 text-center font-family-uroob font-bold tracking-[0.02em] text-4xl lg:pb-0 lg:text-left lg:text-7xl">
                        {title}
                    </h2>

                </div>)}
            </div>


            <div
                className={`mx-auto px-(--gutter-width) 
        font-family-malini text-xl font-semibold
        [&_h2]:font-family-uroob [&_h2]:tracking-wide [&_h2]:text-[3.5rem] [&_h2]:leading-12 [&_h2]:text-balance
        [&_h3]:font-family-uroob [&_h3]:tracking-wide [&_h3]:text-[2.25rem] [&_h3]:leading-9 [&_h3]:text-balance
        `}
            >

                {/* MAIN */}
                <MotionContainer>
                    <MotionItem type="center">
                        <MainFeature {...props} item={main} />
                    </MotionItem>
                </MotionContainer>

                {/* BOTTOM */}
                <MotionContainer className="grid grid-cols-4 lg:grid-cols-12 my-6 gap-x-4 lg:my-10">
                    {bottom.map((item, i) => (
                        <MotionItem
                            key={i}
                            type="bottom"
                            index={i}
                            className="col-span-full inline-grid size-full lg:col-span-3"
                        >
                            <BottomItem {...props} item={item} />
                        </MotionItem>
                    ))}
                </MotionContainer>

            </div>
        </section>
    );
}

/* ---------------- MAIN FEATURE ---------------- */

function MainFeature<T>(props: LayoutPropsType<T> & { item: T }) {
    const item = props.item;

    const link = props.link(item);
    const image = props.image?.(item);
    const heading = props.heading(item);
    const description = props.description?.(item);
    const subDescription = props.subDescription?.(item);

    return (
        <Link href={link ?? "#"} className="group block">
            <div className="grid gap-x-4 grid-cols-4 lg:grid-cols-12 border-b-[0.5] border-b-warm-grey-2 lg:border-b-0">

                {/* IMAGE */}
                <div className="relative col-span-full lg:order-2 lg:col-span-8">
                    <figure className="lg:mx-0 overflow-hidden">
                        <div className="relative w-full aspect-square lg:aspect-5/3 overflow-hidden rounded-2xl">
                            {!!image && (
                                <SanityImage
                                    image={image}
                                    width={1200}
                                    sizes="(max-width:1024px) 100vw, 60vw"
                                    className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                                />
                            )}
                        </div>
                    </figure>
                </div>

                {/* TEXT */}
                <div className="col-span-full py-6 lg:col-span-4">
                    <div className="space-y-4 lg:space-y-6">

                        <h2 className="wrap-break-word transition-colors duration-300 group-hover:text-primary">
                            {heading}
                        </h2>

                        {!!description && (
                            <p className="">
                                {description}
                            </p>
                        )}

                        {!!subDescription && (
                            <p className="">
                                {subDescription}
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </Link>
    );
}

/* ---------------- BOTTOM ---------------- */

function BottomItem<T>(props: LayoutPropsType<T> & { item: T }) {
    const item = props.item;

    const link = props.link(item);
    const heading = props.heading(item);
    const subDescription = props.subDescription?.(item)

    return (
        <Link href={link ?? "#"} className="group block">
            <article className="relative items-stretch h-full space-y-4 border-l-[0.5] border-warm-grey-2 p-4 pt-0 lg:pt-4 text-black-coffee">

                <h3 className="transition-colors duration-300 group-hover:text-primary">
                    {heading}
                </h3>

                {!!subDescription && (
                    <p className="">
                        {subDescription}
                    </p>
                )}

            </article>
        </Link>
    );
}