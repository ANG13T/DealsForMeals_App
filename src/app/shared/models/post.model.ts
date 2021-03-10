import { Location } from "./location.model";
import { User } from "./user.model";

export interface Post {
    userProfile: User;
    title: string;
    description: string;
    images: string[];
    createdAt: Date;
    id: string;
    location?: Location; 
    lat?: any;
    lng?: any;
    hash?: any;
  }