import type { Dictionary } from "@dictionaries";

export type HeaderProps = {
    lang: string;
    dict: Dictionary;
};

export type HomeButtonProps = {
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    icon?: React.ReactNode;
    className?: string;
    title?: string;
    onClick?: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    iconClassName?: string;
    isLangEffectIcon?: boolean;
    currentLang?: string;
    iconDirection?: string;
};

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type MarqueeSpeed = 'slow' | 'normal' | 'fast' | number;
export type MarqueeGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export type ClientLogosMarqueeProps = {
    title?: string;
    className?: string;
    logoClassName?: string;
    showTitle?: boolean;
    logoSize?: LogoSize;
    speed?: MarqueeSpeed;
    gap?: MarqueeGap;
    space?: MarqueeGap;
    infiniteLoop?: boolean;
    pauseOnHover?: boolean;
    stopOnHover?: boolean;
    fadeMask?: boolean;
    direction?: 'left' | 'right';
};