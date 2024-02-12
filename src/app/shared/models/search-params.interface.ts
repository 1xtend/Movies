export interface ISearchParams {
  q: string;
  page: number;
  include_adult?: boolean | undefined;
  year?: number | undefined;
}
