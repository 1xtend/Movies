import { IResponse } from '../response.interface';
import { IMovie } from './movie.interface';

export interface IMovieResponse extends IResponse {
  results: IMovie[];
}
