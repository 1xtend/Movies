import { IResponse } from '../response.interface';
import { IMovie } from './movie.interface';

export interface IMoviesResponse extends IResponse {
  results: IMovie[];
}
