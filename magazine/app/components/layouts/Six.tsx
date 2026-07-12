"use server";

import Link from "next/link";
import { MotionContainer, MotionItem } from "./Animations";
import { ImageValueType, LayoutPropsType } from "@/sanity/general_types";
import SanityImage from "../SanityImage";

export default async function Layout6<T>(props: LayoutPropsType<T>) {
    const main = props.items[0];
    const left = props.items[1];
    const right = props.items[2];
    const bottom = props.items.slice(3, 7);
    const title = props.title

    if (!main) return null;

    return (
        <section>
            {/* HEADER */}
            <div className="mx-auto max-w-360 px-(--gutter-width)">
                {title && (<div className="mb-8 border-b-[0.5] border-warm-grey-2 lg:mb-10">
                    <h2 className="pb-4 text-center font-family-uroob font-bold tracking-[0.02em] text-4xl lg:pb-0 lg:text-left lg:text-7xl">
                        {title}
                    </h2>
                </div>)}
            </div>

            <div className={`mx-auto px-(--gutter-width) font-family-malini text-xl font-semibold ${"[&_h1]:font-family-uroob [&_h1]:text-5xl [&_h1]:tracking-[0.02em]"
                } ${"[&_h2]:font-family-uroob [&_h2]:text-4xl [&_h2]:tracking-[0.02em]"
                }`}>

                {/* TOP */}
                <MotionContainer className="grid grid-cols-4 lg:grid-cols-12 gap-x-4 border-b-[0.5] border-b-warm-grey-2 pb-6 lg:border-b-0 lg:pb-0">
                    <MotionItem
                        type="center"
                        className="col-span-full mb-10 lg:mb-0 lg:order-2 lg:col-span-6"
                    >
                        <MainItem {...{ ...props, item: main }} />
                    </MotionItem>

                    {left && (
                        <MotionItem
                            type="side"
                            className="col-span-full mb-4 lg:mb-0 lg:order-1 lg:col-span-3 lg:mt-8"
                        >
                            <SideItem {...{ ...props, item: left }} />
                        </MotionItem>
                    )}

                    {right && (
                        <MotionItem
                            type="side"
                            className="col-span-full mb-4 lg:mb-0 lg:order-4 lg:col-span-3 lg:mt-8"
                        >
                            <SideItem {...{ ...props, item: right }} />
                        </MotionItem>
                    )}
                </MotionContainer>

                {/* BOTTOM */}
                <MotionContainer className="grid grid-cols-4 lg:grid-cols-12 gap-x-4 relative z-20 py-4 mt-6">
                    <div className="absolute w-[calc(100%+2*var(--gutter-width))] h-full bg-white -translate-x-(--gutter-width) z-10">
                    </div>
                    {bottom.map((item, i) => (
                        <MotionItem
                            key={i}
                            type="bottom"
                            index={i}
                            className="col-span-full lg:col-span-3 relative z-20"
                        >
                            <BottomItem {...{ ...props, item }} />
                        </MotionItem>
                    ))}
                </MotionContainer>
            </div>
        </section>
    );
}

/* ---------------- ITEMS ---------------- */

function MainItem<T>(props: LayoutPropsType<T> & { item: T }) {
    const item = props.item
    const link = props.link(item)
    const image = props.image?.(item)
    const heading = props.heading(item)
    const description = props.description?.(item)
    const subDescription = props.subDescription?.(item)

    return (
        <Link href={link ?? "#"} className="group block">
            <article>
                {!!image && (
                    <figure className="mb-4 overflow-hidden">
                        <div className="relative w-full aspect-5/3 rounded-xl overflow-hidden">
                            <SanityImage
                                image={image}
                                width={1200}
                                sizes="(max-width:1024px) 90vw, 44vw"
                                className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            />
                        </div>
                    </figure>
                )}

                <div className="text-center">
                    <h1 className="group-hover:text-primary">
                        {heading}
                    </h1>
                    {!!description && (
                        <p className="">
                            {description}
                        </p>
                    )}
                    {subDescription && (
                        <p className="text-center text-lg font-extrabold mt-4">
                            {subDescription}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}

function SideItem<T>(props: LayoutPropsType<T> & { item: T }) {
    const item = props.item
    const link = props.link(item)
    const image = props.image?.(item)
    const heading = props.heading(item)
    const subDescription = props.subDescription?.(item)

    return (
        <Link href={link ?? "#"} className="group block">
            <article>
                {image && (
                    <figure className="mb-4 overflow-hidden">
                        <div className="relative aspect-square rounded-xl overflow-hidden">
                            <SanityImage
                                image={image}
                                width={1200}
                                sizes="(max-width:1024px) 90vw, 44vw"
                                className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            />
                        </div>
                    </figure>
                )}

                <h1 className="text-center group-hover:text-primary">
                    {heading}
                </h1>

                {subDescription && (
                    <p className="text-center text-lg font-extrabold mt-2">
                        {subDescription}
                    </p>
                )}
            </article>
        </Link>
    );
}

function BottomItem<T>(props: LayoutPropsType<T> & { item: T }) {
    const link = props.link(props.item)
    const heading = props.heading(props.item)
    const subDescription = props.subDescription?.(props.item)
    return (
        <Link href={link ?? "#"} className="group block h-full">
            <article className="border-l-[0.5] border-warm-grey-2 p-4 h-full">
                <h2 className="group-hover:text-primary">
                    {heading}
                </h2>
                {subDescription && (
                    <p className="text-lg font-bold mt-2">
                        {subDescription}
                    </p>
                )}
            </article>
        </Link>
    );
}