"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
    amount?: number;
};

type ItemProps = {
    children: React.ReactNode;
    className?: string;
    type?: "center" | "side" | "bottom" | "grid";
    index?: number;
};

export function MotionContainer({ children, className, amount = 0.6 }: ContainerProps) {
    return (
        <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount }}
            className={className}
        >
            {children}
        </motion.ul>
    );
}

export function MotionItem({
    children,
    className,
    type = "center",
    index = 0,
}: ItemProps) {
    const variant = getVariant(type, index);

    return (
        <motion.li variants={variant} className={className}>
            {children}
        </motion.li>
    );
}

function getVariant(type: string, index: number): Variants {
    if (type === "bottom") {
        return {
            hidden: { opacity: 0, y: 10 },
            show: {
                opacity: 1,
                y: 0,
                transition: {
                    delay: index * 0.03,
                    duration: 0.3,
                    ease: "easeOut",
                },
            },
        };
    }

    if (type === "grid") {
        return {
            hidden: { opacity: 0, y: 16 },
            show: {
                opacity: 1,
                y: 0,
                transition: {
                    delay: index * 0.04,
                    duration: 0.35,
                    ease: "easeOut",
                },
            },
        };
    }

    return {
        hidden: { opacity: 0, y: 12 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: "easeOut" },
        },
    };
}

const container: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.05 },
    },
};