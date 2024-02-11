import { SortByType } from './sort-by.type';

export interface IMediaFilters {
  query: string;
  page: number;
  includeAdult?: boolean | undefined;
  year?: number | undefined;
}

export interface IDiscoverFilters {
  page: number;
  sort_by: SortByType;
  with_genres?: string | undefined;
  year?: number | undefined;
}
