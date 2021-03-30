import { Location } from "./location.model";

export interface User {
    uid: string;
    email: string;
    name: string;
    accountType: 'foodie' | 'foodbank' | 'resturant' | 'other';
    isBusiness:boolean;
    upvotes: string[];
    downvotes: string[];
    photoURL?: string;
    description?:string;
    location?: Location; 
    lat?: any;
    lng?: any;
    phoneNumber?: any;
    hash?: any;
  }