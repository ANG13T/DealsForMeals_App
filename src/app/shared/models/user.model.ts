import { Location } from "./location.model";

export interface User {
    uid: string;
    email: string;
    name: string;
    accountType: 'foodie' | 'foodbank' | 'resturant' | 'other';
    isBusiness:boolean;
    photoURL?: string;
    description?:string;
    location?: Location; 
    position?: any;
  }