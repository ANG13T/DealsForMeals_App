export interface User {
    uid: string;
    email: string;
    name: string;
    location: string;
    accountType: 'store' | 'foodbank';
    photoURL?: string;
  }