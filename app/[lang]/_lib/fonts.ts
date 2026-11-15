import localFont from 'next/font/local';

export const cairo = localFont({
  src: [
    {
      path: '../../../public/fonts/cairo/cairo-arabic.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/cairo/cairo-latin.woff2',
      weight: '300 900',
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
  display: 'swap',
});

export const tajawal = localFont({
  src: [
    {
      path: '../../../public/fonts/tajawal/tajawal-300-arabic.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-300-latin.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-400-arabic.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-400-latin.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-500-arabic.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-500-latin.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-700-arabic.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-700-latin.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-800-arabic.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-800-latin.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-900-arabic.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/tajawal/tajawal-900-latin.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-tajawal',
  display: 'swap',
});

export const lexendDeca = localFont({
  src: '../../../public/fonts/lexend-deca/lexend-deca-latin.woff2',
  variable: '--font-primary',
  display: 'swap',
  weight: '300 700',
});

export const roboto = localFont({
  src: '../../../public/fonts/roboto/roboto-latin.woff2',
  variable: '--font-secondary',
  display: 'swap',
  weight: '100 900',
});

export const robotoMono = localFont({
  src: '../../../public/fonts/roboto-mono/roboto-mono-latin.woff2',
  variable: '--font-mono',
  display: 'swap',
  weight: '400 700',
});
