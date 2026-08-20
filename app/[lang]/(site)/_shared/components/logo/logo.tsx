import Image from 'next/image';
import Link from 'next/link';

export type LogoProps = {
  lang: string;
  variant?: 'light' | 'dark';
  className?: string;
};

export function Logo({ lang, variant = 'dark', className = '' }: LogoProps) {
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
        className="h-8 w-auto sm:h-10"
      />
    </Link>
  );
}
