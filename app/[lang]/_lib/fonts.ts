import { Cairo, Tajawal, Lexend_Deca, Roboto, Roboto_Mono } from 'next/font/google';

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  display: 'swap',
  weight: ['300', '400', '500', '700', '800', '900'],
});

export const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-secondary',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});
