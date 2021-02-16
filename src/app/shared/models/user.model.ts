export interface User {
    uid: string;
    email: string;
    name: string;
    accountType: 'store' | 'foodbank';
    photoURL?: string;
    location?: Location
  }