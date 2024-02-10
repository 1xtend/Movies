import { IResponse } from '../response.interface';
import { ITV } from './tv.interface';

export interface ISearchTVsResponse extends IResponse {
  results: ITV[];
}
