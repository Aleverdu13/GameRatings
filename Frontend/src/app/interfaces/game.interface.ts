import { Review } from './review.interface';
export interface Game {
    id: number;
    name: string;
    score: number;
    about: string;
    about_es: string;
    release_date: string;
    price: number;
    screenshot: string[];
    videos: string[];
    platforms: string[];
    sys_req: {
      window: { min: string; recomm: string };
      linux: { min: string; recomm: string };
    };
    tags: string[];
    reviews: Review[];
  }