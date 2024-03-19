import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MediaService } from './media.service';
import { IGenres } from '@app/shared/models/genres.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ILanguage } from '@app/shared/models/language.interface';

const statusText = 'Not found';
const status = 404;

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
    const mockGenres: IGenres = { genres: [{ id: 1, name: 'horror' }] };

    service.getGenres('movie').subscribe((value) => {
      expect(value).toEqual(mockGenres);
    });

    const request = controller.expectOne('/genre/movie/list');
    request.flush(mockGenres);

    expect(request.request.method).toBe('GET');
  });

  it('should handle error if getGenres fails', () => {
    service.getGenres('movie').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.statusText).toBe(statusText);
        expect(err.status).toBe(404);
      },
    });

    const request = controller.expectOne('/genre/movie/list');

    request.error(new ProgressEvent(statusText), {
      status,
      statusText,
    });
  });

  it('getLanguages should return languages', () => {
    const mockLanguages: ILanguage[] = [
      { english_name: 'en', iso_639_1: 'value', name: 'English' },
    ];

    service.getLanguages().subscribe((value) => {
      expect(value).toEqual(mockLanguages);
    });

    const request = controller.expectOne('/configuration/languages');
    request.flush(mockLanguages);

    expect(request.request.method).toBe('GET');
  });

  it('should handle error if getLanguages fails', () => {
    service.getLanguages().subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.statusText).toBe(statusText);
        expect(err.status).toBe(404);
      },
    });

    const request = controller.expectOne('/configuration/languages');

    request.error(new ProgressEvent(statusText), {
      status,
      statusText,
    });
  });
});
