import Link from "next/link";
import type { HomeButtonProps } from "@shared";
import { cn, transitionEffect } from "@shared";
import { ImArrowRight2 } from "react-icons/im";

export const HomeButton = ({
    href,
    type,
    icon = <ImArrowRight2 className="w-4 h-4" />,
    className,
    title,
    onClick,
    disabled = false,
    loading = false,
    iconClassName,
    isLangEffectIcon = false,
    currentLang: lang,
    iconDirection = 'right'
}: HomeButtonProps) => {
    const isButton = type || !href;

    const content = (
        <>
            <span>{title}</span>
            <span
                className={cn(
                    `flex h-8 w-8 text-sm font-bold items-center justify-center rounded-full text-black bg-white shrink-0 ${transitionEffect + "500"}`,
                    isLangEffectIcon &&
                        iconDirection === 'right' ?
                        lang === 'ar' ? 'group-hover:rotate-180 rotate-225' : 'group-hover:rotate-0 -rotate-45' :
                        iconDirection === 'left' ?
                            lang === 'ar' ? 'group-hover:rotate-180 rotate-225' : 'group-hover:rotate-0 -rotate-45' :
                            lang === 'ar' ? 'group-hover:rotate-180 rotate-225' : 'group-hover:rotate-0 -rotate-45',
                    iconClassName
                )}
            >
                {icon}
            </span>
        </>
    );

    const baseClasses = cn(
        "group inline-flex items-center gap-2 rounded-full bg-persici-black px-6 py-2 text-sm font-medium text-white transition-all active:scale-98 cursor-pointer select-none",
        (disabled || loading) && "pointer-events-none opacity-50 cursor-not-allowed",
        className
    );

    if (isButton) {
        return (
            <button
                type={type || 'button'}
                className={baseClasses}
                title={title}
                onClick={onClick}
                disabled={disabled || loading}
                aria-disabled={disabled || loading}
                aria-label={title}
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={disabled ? '#' : (href as string)}
            className={baseClasses}
            title={title}
            onClick={disabled ? (e) => e.preventDefault() : onClick}
            aria-disabled={disabled}
            aria-label={title}
        >
            {content}
        </Link>
    );
};