import Link from "next/link";
import type { HomeButtonProps } from "@shared";
import { cn, transitionEffect } from "@shared";
import { ImArrowRight2 } from "react-icons/im";
import { TbArrowDown } from "react-icons/tb";

export const HomeButton = ({
    href,
    type,
    icon,
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

    const resolvedIcon = icon !== undefined ? icon : (
        iconDirection === 'down' ? <TbArrowDown className="w-4 h-4" /> : <ImArrowRight2 className="w-4 h-4" />
    );
    const hasIcon = resolvedIcon !== null && resolvedIcon !== false;

    const content = (
        <>
            <span>{title}</span>
            {hasIcon && (
                <span
                    className={cn(
                        `flex h-8 w-8 text-sm font-semibold items-center justify-center rounded-full text-black bg-white shrink-0 ${transitionEffect + "500"}`,
                        isLangEffectIcon && (
                            iconDirection === 'down'
                                ? lang === 'ar'
                                    ? 'rotate-45 group-hover:rotate-0'
                                    : '-rotate-45 group-hover:rotate-0'
                                : iconDirection === 'left'
                                ? lang === 'ar'
                                    ? 'group-hover:rotate-180 rotate-225'
                                    : 'group-hover:rotate-0 -rotate-45'
                                : lang === 'ar'
                                ? 'group-hover:rotate-180 rotate-225'
                                : 'group-hover:rotate-0 -rotate-45'
                        ),
                        iconClassName
                    )}
                >
                    {resolvedIcon}
                </span>
            )}
        </>
    );

    const baseClasses = cn(
        "group inline-flex items-center gap-2 rounded-full bg-persici-black px-6 py-2 text-sm font-medium text-white transition-all active:scale-98 cursor-pointer select-none",
        hasIcon ? "justify-between" : "justify-center",
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