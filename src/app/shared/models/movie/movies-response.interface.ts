import { IResponse } from '../response.interface';
import { IMovie } from './movie.interface';

export interface ISearchMoviesResponse extends IResponse {
  results: IMovie[];
}
