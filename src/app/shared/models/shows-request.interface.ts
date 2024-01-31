import { IShow } from './show.interface';

export interface IShowsRequest {
  page: number;
  results: IShow[];
  total_pages: number;
  total_results: number;
}
