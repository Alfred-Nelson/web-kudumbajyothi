"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface YearFilterProps {
    years: string[];
    selectedYear: string;
    onYearChange: (year: string) => void;
}

export function YearFilter({ years, selectedYear, onYearChange }: YearFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Helper to check scroll position
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    // Hooks must always be at the top level
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [years]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const offset = direction === 'left' ? -200 : 200;
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    // Conditional rendering happens AFTER hooks
    if (years.length < 3) return null;

    return (
        <div className="relative flex items-center w-full bg-white py-4 border-b border-black/10">
            {/* Left Button */}
            <div className={`transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                    onClick={() => scroll('left')}
                    className="p-2 hover:bg-black/5 rounded-full"
                >
                    <ChevronLeft className="size-5" />
                </button>
            </div>

            {/* Scrollable Area */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex flex-1 gap-x-2 overflow-x-auto no-scrollbar scroll-smooth items-center px-2"
            >
                <YearPill
                    label="എല്ലാം"
                    active={selectedYear === ""}
                    onClick={() => onYearChange("")}
                />

                {years.map(year => (
                    <YearPill
                        key={year}
                        label={year}
                        active={selectedYear === year}
                        onClick={() => onYearChange(year)}
                    />
                ))}
            </div>

            {/* Right Button */}
            <div className={`transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                    onClick={() => scroll('right')}
                    className="p-2 hover:bg-black/5 rounded-full"
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </div>
    );
}

/* --- Sub-component for the Pill --- */

function YearPill({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`relative px-6 py-2 rounded-full text-sm font-family-malini whitespace-nowrap transition-colors duration-300 z-10 ${active ? 'text-white' : 'text-black/50 hover:text-black'
                }`}
        >
            {active && (
                <motion.div
                    layoutId="activeYearPill"
                    className="absolute inset-0 bg-black rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}
            {label}
        </button>
    );
}