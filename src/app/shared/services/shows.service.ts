import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ShowsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchShows(q: string) {
    this.http.get(`${this.apiUrl}`);
  }
}
