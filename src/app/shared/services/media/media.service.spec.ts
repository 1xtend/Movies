import { errorResponse } from './../../../../testing/index';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MediaService } from './media.service';
import { IGenres } from '@app/shared/models/genres.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ILanguage } from '@app/shared/models/language.interface';
import { expectError } from 'src/testing';

const mockGenresRes: IGenres = { genres: [{ id: 1, name: 'horror' }] };
const mockLanguagesRes: ILanguage[] = [
  { english_name: 'en', iso_639_1: 'value', name: 'English' },
];

describe('MediaService', () => {
  let service: MediaService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(MediaService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('getGenres should return genres', () => {
    service.getGenres('movie').subscribe((value) => {
      expect(value).toEqual(mockGenresRes);
    });

    const request = controller.expectOne('/genre/movie/list');
    request.flush(mockGenresRes);

    expect(request.request.method).toBe('GET');
  });

  it('should handle error if getGenres fails', () => {
    service.getGenres('movie').subscribe({
      error: (err: HttpErrorResponse) => {
        expectError(err);
      },
    });

    const request = controller.expectOne('/genre/movie/list');

    request.error(new ProgressEvent('Error'), errorResponse);
  });

  it('getLanguages should return languages', () => {
    service.getLanguages().subscribe((value) => {
      expect(value).toEqual(mockLanguagesRes);
    });

    const request = controller.expectOne('/configuration/languages');
    request.flush(mockLanguagesRes);

    expect(request.request.method).toBe('GET');
  });

  it('should handle error if getLanguages fails', () => {
    service.getLanguages().subscribe({
      error: (err: HttpErrorResponse) => {
        expectError(err);
      },
    });

    const request = controller.expectOne('/configuration/languages');

    request.error(new ProgressEvent('Error'), errorResponse);
  });
});
