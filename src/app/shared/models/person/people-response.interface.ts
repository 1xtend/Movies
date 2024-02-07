import { IResponse } from './../response.interface';
import { IDetailsPerson, ISearchPerson } from './person.interface';

export interface ISearchPeopleResponse extends IResponse {
  results: ISearchPerson[];
}

export interface IDetailsPeopleResponse extends IResponse {
  results: IDetailsPerson[];
}
