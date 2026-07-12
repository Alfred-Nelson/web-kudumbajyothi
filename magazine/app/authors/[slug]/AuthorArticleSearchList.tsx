"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, LoaderCircle, Ellipsis } from "lucide-react"; // Import Ellipsis
import SanityImage from '@/app/components/SanityImage';
import { Article } from '@/sanity/types';
import APIS from '@/sanity/api';
import { AnimatePresence, motion } from 'framer-motion';

export function AuthorArticleSearchList({
    initialArticles,
    authorId
}: {
    initialArticles: Article[],
    authorId: string
}) {
    const [articles, setArticles] = useState(initialArticles);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(initialArticles.length >= 12);

    const loaderRef = useRef<HTMLDivElement>(null);

    // 1. Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Standard reset for search
    useEffect(() => {
        const resetAndFetch = async () => {
            setIsFetching(true);
            try {
                const result = await APIS.getArticlesByAuthorSearch(authorId, debouncedQuery, 0, 12);
                setArticles(result || []);
                setHasMore(result?.length === 12);
            } finally {
                setIsFetching(false);
            }
        };
        resetAndFetch();
    }, [debouncedQuery, authorId]);

    // 3. Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isFetching) {
                const loadMore = async () => {
                    setIsFetching(true);
                    // Use the functional setArticles approach to avoid dependency array issues
                    setArticles(prev => {
                        APIS.getArticlesByAuthorSearch(authorId, debouncedQuery, prev.length, 12)
                            .then(result => {
                                setArticles(old => [...old, ...(result || [])]);
                                setHasMore(result?.length === 12);
                                setIsFetching(false);
                            })
                            .catch(() => setIsFetching(false));
                        return prev;
                    });
                };
                loadMore();
            }
        }, { threshold: 0.1 });

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isFetching, authorId, debouncedQuery]);

    return (
        <div className="space-y-12">
            {/* SEARCH INPUT WITH INTEGRATED LOADER */}
            <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />

                <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-warm-grey-2 focus:border-primary outline-none font-family-malini transition-all bg-warm-grey-3/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* ANIMATED ELLIPSIS */}
                <AnimatePresence>
                    {isFetching && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                            <Ellipsis className="size-6 animate-[pulse_1s_infinite]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))
                ) : !isFetching && (
                    <div className="col-span-full py-20 text-center">
                        <p className="font-family-malini text-gray-500 text-xl">
                            ലേഖനങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.
                        </p>
                    </div>
                )}
            </div>

            {/* BOTTOM LOADER (HIDDEN IF TOP LOADER IS ACTIVE OR NO MORE ARTICLES) */}
            <div ref={loaderRef} className="flex justify-center py-20 min-h-24">
                {isFetching && articles.length > 0 && (
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary/60" />
                )}
            </div>
        </div>
    );
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={`/articles/${article.slug?.current}`}
            className="group block space-y-4 hover:bg-black/5 p-2 transition-all rounded-md"
        >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-warm-grey-2">
                <SanityImage
                    image={article.mainImage}
                    width={600}
                    className="transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="space-y-2">
                <h3 className="font-family-uroob text-4xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {article.malayalamTitle}
                </h3>
                <p className="font-family-malini text-lg text-black/70 line-clamp-3 text-pretty">
                    {article.description}
                </p>
            </div>
        </Link>
    );
}