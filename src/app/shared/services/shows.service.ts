import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IShowsRequest } from '../models/shows-request.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowsService {
  constructor(private http: HttpClient) {}

  searchShows(query: string): Observable<IShowsRequest> {
    return this.http.get<IShowsRequest>(`/search/movie`, {
      params: {
        query,
      },
    });
  }
}
