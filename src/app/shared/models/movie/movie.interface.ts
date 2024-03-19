import { IGenre } from '../genres.interface';
import { ILanguage } from '../language.interface';
import { INetwork } from '../network.interface';
import { IProductionCountry } from '../production-country.interface';
import { IReviewsResponse } from '../review.interface';
import { IMoviesResponse } from './movies-response.interface';

export interface IMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: 11.525;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IDetailsMovie {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: IBelongsToCollection;
  budget: number;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: INetwork[];
  production_countries: IProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: ILanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  similar?: IMoviesResponse;
  reviews?: IReviewsResponse;
}

// Parts
export interface IBelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}
