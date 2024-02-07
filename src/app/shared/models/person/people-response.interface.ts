import { IResponse } from './../response.interface';
import { IPerson } from './person.interface';

export interface IPeopleResponse extends IResponse {
  results: IPerson[];
}
