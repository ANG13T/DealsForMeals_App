import { Location } from "./location.model";
import { User } from "./user.model";

export interface Deal {
    userProfile: User;
    title: string;
    description: string;
    images: string[];
    createdAt: Date;
    id: string;
    votes: number;
    location?: Location; 
    lat?: any;
    lng?: any;
    hash?: any;
  }