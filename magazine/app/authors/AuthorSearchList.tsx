"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, LoaderCircle, Ellipsis } from "lucide-react";
import SanityImage from '../components/SanityImage';
import APIS from '@/sanity/api'; // Standardized to use your API abstraction

export function AuthorSearchList({ initialAuthors }: { initialAuthors: any[] }) {
    const [authors, setAuthors] = useState(initialAuthors);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(initialAuthors.length >= 10);

    const loaderRef = useRef<HTMLDivElement>(null);

    // 1. Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Fetching Logic (Using API abstraction & Functional Updates)
    const fetchAuthors = useCallback(async (isNewSearch: boolean) => {
        if (isFetching) return;
        setIsFetching(true);

        try {
            // We use a functional update to get the latest length without adding 'authors' to deps
            setAuthors((currentAuthors) => {
                const start = isNewSearch ? 0 : currentAuthors.length;

                (async () => {
                    // Use your searchAuthors API method
                    const result = await APIS.searchAuthors(debouncedQuery, start, 10);

                    if (isNewSearch) {
                        setAuthors(result || []);
                    } else {
                        setAuthors(prev => [...prev, ...(result || [])]);
                    }

                    setHasMore(result?.length === 10);
                    setIsFetching(false);
                })();

                return currentAuthors;
            });
        } catch (error) {
            console.error("Author Search Error:", error);
            setIsFetching(false);
        }
    }, [debouncedQuery]); // Stable dependencies: only query triggers a change

    // Trigger search when debounced query updates
    useEffect(() => {
        fetchAuthors(true);
    }, [debouncedQuery]);

    // 3. Infinite Scroll (Intersection Observer)
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isFetching) {
                fetchAuthors(false);
            }
        }, { threshold: 0.1 });

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isFetching, fetchAuthors]);

    return (
        <div className="">
            {/* SEARCH INPUT WITH INTEGRATED LOADER */}
            <div className="relative max-w-md mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />

                <input
                    type="text"
                    placeholder="Search authors ..."
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-black/20 focus:border-primary outline-none font-family-malini transition-all bg-warm-grey-3/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* ANIMATED ELLIPSIS IN THE INPUT */}
                {isFetching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                        <Ellipsis className="size-6 animate-[pulse_1s_infinite]" />
                    </div>
                )}
            </div>

            {/* LIST */}
            <div className="flex flex-col border-t border-black/20">
                {authors.length > 0 ? (
                    authors.map((author) => (
                        <AuthorRow key={author._id} author={author} />
                    ))
                ) : !isFetching && (
                    <div className="py-20 text-center border-b border-black/20">
                        <p className="font-family-malini text-gray-500 text-xl">
                            ലേഖകരെ ഒന്നും കണ്ടെത്തിയില്ല.
                        </p>
                    </div>
                )}
            </div>

            {/* SENTINEL / BOTTOM LOADER */}
            <div ref={loaderRef} className="flex justify-center min-h-8 mt-4 py-10">
                {isFetching && authors.length > 0 && (
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary/60" />
                )}
            </div>
        </div>
    );
}

/* ---------------- AUTHOR ROW ---------------- */

function AuthorRow({ author }: { author: any }) {
    return (
        <Link
            href={`/authors/${author.slug}`}
            className="group block border-b border-black/20 hover:bg-black/[0.02] transition-colors"
        >
            <div className="flex items-center gap-x-6 py-8 px-0">
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-warm-grey-2 md:w-32">
                    {author.profileImage && (
                        <SanityImage
                            image={author.profileImage}
                            width={300}
                            sizes="150px"
                            className="transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                    )}
                </div>
                <div className="flex flex-col justify-center space-y-1">
                    <h2 className="font-family-uroob text-3xl md:text-5xl group-hover:text-primary transition-colors text-balance">
                        {author.malayalamName || author.name}
                    </h2>
                    {author.bio && (
                        <p className="font-family-malini line-clamp-2 text-lg text-black/70 text-pretty max-w-2xl">
                            {author.bio}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}