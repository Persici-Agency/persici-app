export interface ClientLogo {
  name: string;
  src: string;
}

export const clientLogos: ClientLogo[] = [
  { name: '7awi', src: '/images/clients/7awi logo.png' },
  { name: 'Accor Live Limitless', src: '/images/clients/ALL - Accor Live Limitless logo.png' },
  { name: 'Alhokair Holding', src: '/images/clients/Alhokair Holding logo.png' },
  { name: 'Chop On UAE', src: '/images/clients/Chop On Uae logo.png' },
  { name: 'Hadiya', src: '/images/clients/Hadiya logo.png' },
  { name: 'Hala Food', src: '/images/clients/Hala Food logo.png' },
  { name: 'Hokair Group', src: '/images/clients/Hokair Group logo.png' },
  { name: 'Khazan', src: '/images/clients/Khazan logo.png' },
  { name: 'Lahfaa', src: '/images/clients/Lahfaa logo logo.png' },
  { name: 'Land of Exotics', src: '/images/clients/Land of Exotics logo.png' },
  { name: 'Mashreq', src: '/images/clients/Mashreq logo.png' },
  { name: 'Meraas', src: '/images/clients/Meraas logo.png' },
  { name: 'Metal Fuze', src: '/images/clients/Metal Fuze logo.png' },
  { name: 'Protes', src: '/images/clients/Protes logo.png' },
  { name: 'The Harmony', src: '/images/clients/The Harmony logo.png' },
];

export function getClientLogos(): ClientLogo[] {
  return clientLogos;
}
