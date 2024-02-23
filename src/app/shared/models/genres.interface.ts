import { MediaType } from './media.type';

export interface IGenres {
  genres: IGenre[];
}

export interface IGenre {
  id: number;
  name: string;
}

export type SavedGenresType = {
  // tv: IGenre[] | undefined;
  // movie: IGenre[] | undefined;
  [T in Exclude<MediaType, 'person'>]: IGenre[] | undefined;
};
