import { IResponse } from './../response.interface';
import { IDetailsPerson, IPerson } from './person.interface';

export interface ISearchPeopleResponse extends IResponse {
  results: IPerson[];
}
