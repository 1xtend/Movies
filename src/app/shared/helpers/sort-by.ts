import { MediaType } from '../models/media.type';
import { MovieSortByType, TVSortByType } from '../models/sort-by.type';

export interface ISortBy<T extends MovieSortByType | TVSortByType> {
  name: string;
  value: T;
}

export const movieSortBy: ISortBy<MovieSortByType>[] = [
  {
    name: 'Popularity Descending',
    value: 'popularity.desc',
  },
  {
    name: 'Popularity Ascending',
    value: 'popularity.asc',
  },
  {
    name: 'Vote Count Descending',
    value: 'vote_count.desc',
  },
  {
    name: 'Vote Count Ascending',
    value: 'vote_count.asc',
  },
  {
    name: 'Release Date Descending',
    value: 'primary_release_date.desc',
  },
  {
    name: 'Release Date Ascending',
    value: 'primary_release_date.asc',
  },
  {
    name: 'Title [A-Z]',
    value: 'title.desc',
  },
  {
    name: 'Title [Z-A]',
    value: 'title.asc',
  },
];

export const tvSortBy: ISortBy<TVSortByType>[] = [
  {
    name: 'Popularity Descending',
    value: 'popularity.desc',
  },
  {
    name: 'Popularity Ascending',
    value: 'popularity.asc',
  },
  {
    name: 'Vote Count Descending',
    value: 'vote_count.desc',
  },
  {
    name: 'Vote Count Ascending',
    value: 'vote_count.asc',
  },
  {
    name: 'First Air Date Descending',
    value: 'first_air_date.desc',
  },
  {
    name: 'First Air Date Ascending',
    value: 'first_air_date.asc',
  },
  {
    name: 'Name [A-Z]',
    value: 'name.desc',
  },
  {
    name: 'Name [Z-A]',
    value: 'name.asc',
  },
];

export const sortBy: {
  [K in Exclude<MediaType, 'person'>]: ISortBy<
    MovieSortByType | TVSortByType
  >[];
} = {
  movie: movieSortBy,
  tv: tvSortBy,
};
