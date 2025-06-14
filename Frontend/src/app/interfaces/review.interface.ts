import { User } from "./user.interface";

export interface Review {
    id: number;
    user: User;
    user_id: number;
    score: number;
    comment: string;
    date: string;
    user_name: string;
    user_profile: string;
    base_score: number;
  }
  