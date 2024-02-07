import { IResponse } from '../response.interface';
import { ISearchTV } from './tv.interface';

export interface ISearchTVsResponse extends IResponse {
  results: ISearchTV[];
}
