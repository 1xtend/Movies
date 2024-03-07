import { IGenre } from '../genres.interface';
import { INetwork } from '../network.interface';
import { IProductionCountry } from '../production-country.interface';
import { IReviewsResponse } from '../review.interface';
import { ISeason } from '../season.interface';
import { ITVsResponse } from './tvs-response.interface';

export interface ITV {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface IDetailsTV {
  adult: boolean;
  backdrop_path: string | null;
  created_by: ICreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: IGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: ILastEpisodeToAir;
  name: string;
  next_episode_to_air: null;
  networks: INetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: INetwork[];
  production_countries: IProductionCountry[];
  seasons: ISeason[];
  spoken_languages: string[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  similar?: ITVsResponse;
  reviews?: IReviewsResponse;
}

// Parts
interface ICreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

interface ILastEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}
