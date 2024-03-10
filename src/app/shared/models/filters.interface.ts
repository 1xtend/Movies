import { MovieSortByType, TVSortByType } from '@app/shared/models/sort-by.type';

export interface IFilters {
  page: number;
  include_adult: boolean;
  sort_by?: MovieSortByType | TVSortByType;
  with_genres?: string | undefined;
  language?: string | undefined;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  query?: string;
  first_air_date_year?: number;
  primary_release_year?: number;
}
