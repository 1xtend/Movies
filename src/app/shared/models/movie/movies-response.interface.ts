import { IResponse } from '../response.interface';
import { IMovie } from './movie.interface';

export interface IMoviesResponse extends IResponse {
  results: IMovie[];
}

export interface INowPlayingMoviesResponse extends IResponse {
  results: IMovie[];
  dates: {
    maximum: string;
    minimum: string;
  };
}
