import { IResponse } from '../response.interface';
import { ITV } from './tv.interface';

export interface ITVResponse extends IResponse {
  results: ITV[];
}
