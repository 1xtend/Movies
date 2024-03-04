import { IResponse } from './response.interface';

export interface IReview {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface IReviewsResponse extends IResponse {
  results: IReview[];
}
