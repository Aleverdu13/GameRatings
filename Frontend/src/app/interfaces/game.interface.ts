import { Review } from './review.interface';
export interface Game {
    id: number;
    name: string;
    score: number;
    about: string;
    release_date: string;
    price: number;
    screenshot: string[];
    videos: string[];
    platforms: string[];
    sys_req: {
      windows: { min: string; recomm: string };
      linux: { min: string; recomm: string };
    };
    tags: string[];
    reviews: Review[];
  }