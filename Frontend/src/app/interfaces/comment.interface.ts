import { User } from './user.interface';

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
  vote_count: number;
  review_id: number;
  parent_id?: number;
  replies?: Comment[];
}
