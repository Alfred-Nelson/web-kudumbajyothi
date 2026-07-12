"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Search, LoaderCircle, Ellipsis } from "lucide-react";
import SanityImage from '../components/SanityImage';
import APIS from '@/sanity/api';
import { Article, ARTICLES_SEARCH_RESULT } from '@/sanity/types';
import { YearFilter } from './YearFilter';

const getMalayalamMonth = (dateString?: string) => {
    if (!dateString) return "മറ്റുള്ളവ";
    const date = new Date(dateString);
    const months = ["ജനുവരി", "ഫെബ്രുവരി", "മാർച്ച്", "ഏപ്രിൽ", "മേയ്", "ജൂൺ", "ജൂലൈ", "ഓഗസ്റ്റ്", "സെപ്റ്റംബർ", "ഒക്ടോബർ", "നവംബർ", "ഡിസംബർ"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

export function ArticleSearchList({ initialArticles }: { initialArticles: (Article | ARTICLES_SEARCH_RESULT[number])[] }) {
    const [articles, setArticles] = useState<(Article | ARTICLES_SEARCH_RESULT[number])[]>(initialArticles);
    const [years, setYears] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(initialArticles.length >= 12);

    // Initial Year Load
    useEffect(() => {
        APIS.getUniqueYears().then(setYears);
    }, []);

    // Grouping
    const groupedArticles = useMemo(() => {
        const groups: Record<string, (Article | ARTICLES_SEARCH_RESULT[number])[]> = {};
        articles.forEach((article) => {
            const dateKey = getMalayalamMonth(article.publishedAt);
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(article);
        });
        return groups;
    }, [articles]);

    const fetchArticles = useCallback(async (isNewSearch: boolean) => {
        if (isFetching) return;
        setIsFetching(true);
        const start = isNewSearch ? 0 : articles.length;

        try {
            const result = await APIS.searchArticles(debouncedQuery, start, 12, selectedYear);
            const data = result || [];
            setArticles(prev => isNewSearch ? data : [...prev, ...data]);
            setHasMore(data.length === 12);
        } finally {
            setIsFetching(false);
        }
    }, [debouncedQuery, selectedYear, articles.length, isFetching]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => { fetchArticles(true); }, [debouncedQuery, selectedYear]);

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-black/10 focus:border-black outline-none font-family-malini bg-warm-grey-3/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isFetching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Ellipsis className="size-6 animate-pulse" />
                    </div>
                )}
            </div>

            <YearFilter
                years={years}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
            />

            <div className="space-y-16 pt-8">
                {Object.entries(groupedArticles).map(([month, items]) => (
                    <div key={month} className="space-y-8">
                        <h3 className="font-family-uroob text-4xl border-b border-black/10 pb-2">{month}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {items.map((article) => (
                                <ArticleCard key={article._id} article={article as ARTICLES_SEARCH_RESULT[number]} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sentinel */}
            <div className="flex justify-center py-20">
                {isFetching && <LoaderCircle className="animate-spin size-8 text-black/10" />}
            </div>
        </div>
    );
}

function ArticleCard({ article }: { article: ARTICLES_SEARCH_RESULT[number] }) {
    return (
        <Link href={`/articles/${article.slug}`} className="group flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-warm-grey-2">
                {article.mainImage && (
                    <SanityImage image={article.mainImage} width={600} className="object-cover transition-transform duration-700 group-hover:scale-105 h-full w-full" />
                )}
            </div>
            <h2 className="font-family-uroob text-3xl md:text-4xl leading-tight group-hover:text-primary transition-colors mt-4">{article.malayalamTitle || article.title}</h2>
            {article.description && <p className="font-family-malini text-lg text-black/70 line-clamp-3">{article.description}</p>}
            <div className="pt-1">
                <span className="font-family-malini text-lg font-semibold text-black/40 uppercase">
                    –– {article.author?.malayalamName || article.author?.name || "ലേഖകൻ"} ––
                </span>
            </div>
        </Link>
    );
}