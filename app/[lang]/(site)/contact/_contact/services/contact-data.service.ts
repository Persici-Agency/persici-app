export interface ContactOffice {
  city: string;
  address: string;
  email: string;
  phone: string;
}

export const contactOffices: ContactOffice[] = [
  {
    city: 'Dubai',
    address: 'Dubai Internet City, Building 3',
    email: 'dubai@persici.com',
    phone: '+971 4 000 0000',
  },
  {
    city: 'Riyadh',
    address: 'King Fahd Road, Al Olaya',
    email: 'riyadh@persici.com',
    phone: '+966 11 000 0000',
  },
  {
    city: 'Stockholm',
    address: 'Birger Jarlsgatan 18, Östermalm',
    email: 'stockholm@persici.com',
    phone: '+46 8 000 0000',
  },
];

export function getContactOffices(): ContactOffice[] {
  return contactOffices;
}
