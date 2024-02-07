export interface ISearchPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: string;
  profile_path: null | string;
  // known_for: IShowMediaType[];
}
