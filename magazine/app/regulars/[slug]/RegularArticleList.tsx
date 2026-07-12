"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SanityImage from "@/app/components/SanityImage";

export function RegularArticleList({ articles }: { articles: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredArticles, setFilteredArticles] = useState(articles);

    const shouldEnableSearch = articles.length > 15;

    useEffect(() => {
        if (!searchQuery) {
            setFilteredArticles(articles);
            return;
        }

        const q = searchQuery.toLowerCase();

        const filtered = articles.filter((article) =>
            article.title?.toLowerCase().includes(q) ||
            article.malayalamTitle?.toLowerCase().includes(q)
        );

        setFilteredArticles(filtered);
    }, [searchQuery, articles]);

    return (
        <div className="space-y-12">

            {/* SEARCH */}
            {shouldEnableSearch && (
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />

                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/20 focus:border-primary outline-none font-family-malini bg-warm-grey-3/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <p className="font-family-malini text-gray-500 text-xl">
                            ലേഖനങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}


function ArticleCard({ article }: { article: any }) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group block space-y-4"
        >
            {/* IMAGE CONTAINER FIX ✅ */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-warm-grey-2">
                <SanityImage
                    image={article.mainImage}
                    width={600}
                    className="transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* CONTENT */}
            <div className="space-y-2">
                <h3 className="font-family-uroob text-2xl md:text-3xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {article.malayalamTitle}
                </h3>

                {article.description && (
                    <p className="font-family-malini text-base text-black/70 line-clamp-3">
                        {article.description}
                    </p>
                )}

                {article.author && (
                    <p className="text-sm text-black/50">
                        {article.author.malayalamName || article.author.name}
                    </p>
                )}
            </div>
        </Link>
    );
}