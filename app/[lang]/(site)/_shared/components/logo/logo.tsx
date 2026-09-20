import Image from 'next/image';
import Link from 'next/link';

export type LogoProps = {
  lang: string;
  variant?: 'light' | 'dark';
  className?: string;
  imageClassName?: string;
};

export function Logo({
  lang,
  variant = 'dark',
  className = '',
  imageClassName = 'h-8 sm:h-9 xl:h-10',
}: LogoProps) {
  const src =
    variant === 'light'
      ? '/persici-light-logo-horizontal.webp'
      : '/persici-dark-logo-horizontal.webp';

  return (
    <Link href={`/${lang}`} className={`inline-block ${className}`}>
      <Image
        src={src}
        alt="Persici"
        width={160}
        height={40}
        priority
        className={`w-auto ${imageClassName}`}
      />
    </Link>
  );
}
