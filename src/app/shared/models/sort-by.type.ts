type SortByValueType =
  | 'popularity.asc'
  | 'popularity.desc'
  | 'vote_average.asc'
  | 'vote_average.desc'
  | 'vote_count.asc'
  | 'vote_count.desc';

export type MovieSortByType =
  | 'original_title.asc'
  | 'original_title.desc'
  | 'revenue.asc'
  | 'revenue.desc'
  | 'primary_release_date.asc'
  | 'primary_release_date.desc'
  | 'title.asc'
  | 'title.desc'
  | SortByValueType;

export type TVSortByType =
  | 'original_name.asc'
  | 'original_name.desc'
  | 'name.asc'
  | 'name.desc'
  | 'first_air_date.desc'
  | 'first_air_date.asc'
  | SortByValueType;
