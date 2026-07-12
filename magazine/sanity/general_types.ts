import { CustomImage } from "./types";

type Resolver<T> = (item: T) => string | null | undefined;

type ImageValueType = CustomImage | null | undefined;

type LayoutPropsType<T> = {
    items: T[];
    heading: Resolver<T>;
    description?: Resolver<T>;
    subDescription?: Resolver<T>
    image?: (item: T) => ImageValueType;
    link: Resolver<T>;
    title?: string;
};

type LayoutKindType = "layout1" | "layout2" | "layout3" | "layout4" | "layout5" | "layout6"

export type {
    LayoutPropsType,
    ImageValueType,
    Resolver,
    LayoutKindType
}