import { IResponse } from './../response.interface';
import { ISearchPerson } from './person.interface';

export interface ISearchPeopleResponse extends IResponse {
  results: ISearchPerson[];
}
