import type { Dictionary } from "@dictionaries";

export const cn = (...inputs: (string | undefined | null | false)[]): string => {
    return inputs.filter(Boolean).join(" ");
};

export const getDict = async (lang: string): Promise<Dictionary> => {
    const d = await import(`@dictionaries/${lang}.json`).catch(() => import("@dictionaries/en.json"));
    return d.default || d;
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
    try {
        const dictionary = await import(`@dictionaries/${locale}.json`);
        return dictionary.default || dictionary;
    } catch (error) {
        console.error(`Failed to load dictionary for ${locale}:`, error);
        const fallback = await import("@dictionaries/en.json");
        return fallback.default || fallback;
    }
};
