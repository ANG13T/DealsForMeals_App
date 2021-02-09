export interface User {
    uid: string;
    email: string;
    name: string;
    location: string;
    accountType: 'donator' | 'food bank';
    photoURL?: string;
  }