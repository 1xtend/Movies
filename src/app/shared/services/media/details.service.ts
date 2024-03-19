import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaType } from '@app/shared/models/media.type';
import { IDetailsMovie } from '@app/shared/models/movie/movie.interface';
import { IDetailsPerson } from '@app/shared/models/person/person.interface';
import { IDetailsTV } from '@app/shared/models/tv/tv.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  constructor(private http: HttpClient) {}

  private getDetails<T>(
    type: MediaType,
    id: number,
    language?: string
  ): Observable<T> {
    let params = new HttpParams();

    if (type !== 'person') {
      params = params.append('append_to_response', 'similar,reviews');
    } else {
      params = params.append('append_to_response', 'images');
    }

    if (language && language !== 'xx') {
      params = params.append('language', language);
    }

    return this.http.get<T>(`/${type}/${id}`, {
      params,
    });
  }

  getTVDetails(id: number, language?: string): Observable<IDetailsTV> {
    return this.getDetails<IDetailsTV>('tv', id, language);
  }

  getMovieDetails(id: number, language?: string): Observable<IDetailsMovie> {
    return this.getDetails<IDetailsMovie>('movie', id, language);
  }

  getPersonDetails(id: number): Observable<IDetailsPerson> {
    return this.getDetails<IDetailsPerson>('person', id);
  }
}
