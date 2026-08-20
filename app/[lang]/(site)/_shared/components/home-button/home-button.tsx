import Link from "next/link";
import type { HomeButtonProps } from "@shared";
import { cn, transitionEffect } from "@shared";
import { HiOutlineArrowRight } from "react-icons/hi";
export const HomeButton = ({
    href,
    icon = <HiOutlineArrowRight className="w-4 h-4" />,
    className,
    title,
    onClick,
    disabled = false,
    iconClassName,
    isLangEffectIcon = false,
    currentLang: lang
}: HomeButtonProps) => {
    return (
        <Link
            href={disabled ? '#' : href}
            className={cn(
                "hidden group sm:inline-flex items-center gap-2 rounded-full bg-persici-black px-6 py-2 text-sm font-medium text-white shadow-xs transition-all hover:shadow-md active:scale-98",
                disabled && "pointer-events-none opacity-50 cursor-not-allowed",
                className
            )}
            title={title}
            onClick={disabled ? (e) => e.preventDefault() : onClick}
            aria-disabled={disabled}
            aria-label={title}
        >
            <span>{title}</span>
            <span className={cn(`flex h-8 w-8 text-sm font-bold items-center justify-center group-hover:rotate-0 rotate-[-40deg] rounded-full text-black bg-white ${transitionEffect + "400"}`, iconClassName)}>
                {
                    isLangEffectIcon &&
                    <>
                        {lang === 'ar' ? <span className="rotate-180">{icon}</span> : icon}
                    </>
                }
                {
                    !isLangEffectIcon && <>{icon}</>
                }
            </span>
        </Link>
    );
};