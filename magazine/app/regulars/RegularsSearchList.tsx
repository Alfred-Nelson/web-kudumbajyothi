"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, LoaderCircle, Ellipsis } from "lucide-react";
import SanityImage from "../components/SanityImage";
import APIS from "@/sanity/api";

export function RegularsSearchList({ initialRegulars }: { initialRegulars: any[] }) {
    const [regulars, setRegulars] = useState(initialRegulars);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(initialRegulars.length >= 10);

    const loaderRef = useRef<HTMLDivElement>(null);

    // debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchRegulars = useCallback(async (isNewSearch: boolean) => {
        if (isFetching) return;
        setIsFetching(true);

        try {
            setRegulars((current) => {
                const start = isNewSearch ? 0 : current.length;

                (async () => {
                    const result = await APIS.searchRegulars(debouncedQuery, start, 10);

                    if (isNewSearch) {
                        setRegulars(result || []);
                    } else {
                        setRegulars((prev) => [...prev, ...(result || [])]);
                    }

                    setHasMore(result?.length === 10);
                    setIsFetching(false);
                })();

                return current;
            });
        } catch (err) {
            console.error(err);
            setIsFetching(false);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        fetchRegulars(true);
    }, [debouncedQuery]);

    // infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isFetching) {
                fetchRegulars(false);
            }
        });

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isFetching, fetchRegulars]);

    return (
        <div>

            {/* SEARCH */}
            <div className="relative max-w-md mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />

                <input
                    type="text"
                    placeholder="Search series..."
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-black/20 focus:border-primary outline-none font-family-malini bg-warm-grey-3/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {isFetching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                        <Ellipsis className="size-6 animate-[pulse_1s_infinite]" />
                    </div>
                )}
            </div>

            {/* LIST */}
            <div className="flex flex-col border-t border-black/20">
                {regulars.length > 0 ? (
                    regulars.map((item) => (
                        <RegularRow key={item._id} item={item} />
                    ))
                ) : !isFetching && (
                    <div className="py-20 text-center">
                        ഒന്നും കണ്ടെത്തിയില്ല
                    </div>
                )}
            </div>

            {/* LOADER */}
            <div ref={loaderRef} className="flex justify-center py-10">
                {isFetching && regulars.length > 0 && (
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary/60" />
                )}
            </div>

        </div>
    );
}


function RegularRow({ item }: { item: any }) {
    return (
        <Link
            href={`/series/${item.slug}`}
            className="group block border-b border-black/20 hover:bg-black/[0.02]"
        >
            <div className="grid grid-cols-12 gap-6 py-10">

                {/* IMAGE */}
                <div className="col-span-12 md:col-span-3">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">

                        {item.coverImage && (
                            <SanityImage
                                image={item.coverImage}
                                width={600}
                                sizes="(max-width:768px) 100vw, 25vw"
                                className="transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        )}

                    </div>
                </div>

                {/* CONTENT */}
                <div className="col-span-12 md:col-span-9 space-y-4">

                    {/* TITLE */}
                    <h2 className="font-family-uroob text-3xl md:text-5xl group-hover:text-primary">
                        {item.malayalamTitle}
                    </h2>

                    {/* DESCRIPTION */}
                    {item.description && (
                        <p className="font-family-malini text-lg text-black/70 max-w-2xl">
                            {item.description}
                        </p>
                    )}

                    {/* META */}
                    <div className="text-sm text-gray-500">
                        {item.articlesCount} ലേഖനങ്ങൾ
                    </div>

                    {/* PREVIEW ARTICLES */}
                    {item.parts?.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">

                            {item.parts.map((article: any, i: number) => (
                                <div key={i} className="text-sm border-l pl-3">

                                    <p className="font-medium">
                                        {article.malayalamTitle || article.title}
                                    </p>

                                    {article.author && (
                                        <p className="text-gray-500 text-xs">
                                            — {article.author.malayalamName || article.author.name}
                                        </p>
                                    )}

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </Link>
    );
}