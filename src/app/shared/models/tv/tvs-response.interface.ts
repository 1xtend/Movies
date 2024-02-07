import { IResponse } from '../response.interface';
import { IDetailsTV, ISearchTV } from './tv.interface';

export interface ISearchTVsResponse extends IResponse {
  results: ISearchTV[];
}
