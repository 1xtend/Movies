import { IDiscoverFilters } from './filters.interface';

export interface ISearchParams {
  q: string;
  page: number;
  include_adult?: boolean | undefined;
  year?: number | undefined;
}

export interface IDiscoverParams extends IDiscoverFilters {}
