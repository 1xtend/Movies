import { IPerson } from './person.interface';

export interface IPeopleResponse {
  page: number;
  results: IPerson[];
  total_pages: number;
  total_results: number;
}
