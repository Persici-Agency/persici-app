import type { Dictionary } from "@dictionaries";

export type HeaderProps = {
    lang: string;
    dict: Dictionary;
};

export type HomeButtonProps = {
    href: string;
    icon?: React.ReactNode;
    className?: string;
    title?: string;
    onClick?: () => void;
    disabled?: boolean;
    iconClassName?: string;
    isLangEffectIcon?: boolean;
    currentLang?: string;
};