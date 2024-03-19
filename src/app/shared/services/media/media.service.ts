import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGenres } from '@app/shared/models/genres.interface';
import { ILanguage } from '@app/shared/models/language.interface';
import { MediaType } from '@app/shared/models/media.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  // Genres
  getGenres(type: Exclude<MediaType, 'person'>): Observable<IGenres> {
    return this.http.get<IGenres>(`/genre/${type}/list`);
  }

  // Languages
  getLanguages(): Observable<ILanguage[]> {
    return this.http.get<ILanguage[]>(`/configuration/languages`);
  }
}
