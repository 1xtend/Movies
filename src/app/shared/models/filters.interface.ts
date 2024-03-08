import { MovieSortByType, TVSortByType } from '@app/shared/models/sort-by.type';

export interface IMediaFilters {
  query: string;
  page: number;
  include_adult: boolean;
  year?: number | undefined;
}

export interface IDiscoverFilters {
  page: number;
  sort_by: MovieSortByType | TVSortByType;
  include_adult: boolean;
  with_genres?: string | undefined;
  year?: number | undefined;
  language?: string | undefined;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
}

export interface IFilters {
  page: number;
  include_adult: boolean;
  sort_by?: MovieSortByType | TVSortByType;
  with_genres?: string | undefined;
  year?: number | undefined;
  language?: string | undefined;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  query?: string;
}
