import { IResponse } from '../response.interface';
import { ISearchMovie } from './movie.interface';

export interface ISearchMoviesResponse extends IResponse {
  results: ISearchMovie[];
}
