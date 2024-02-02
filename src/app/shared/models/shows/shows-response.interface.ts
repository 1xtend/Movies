import { IShow } from './show.interface';

export interface IShowsResponse {
  page: number;
  results: IShow[];
  total_pages: number;
  total_results: number;
}
