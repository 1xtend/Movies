import { IResponse } from '../response.interface';
import { ITV } from './tv.interface';

export interface ITVsResponse extends IResponse {
  results: ITV[];
}
