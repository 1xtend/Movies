import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SharedService } from './shared.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { first } from 'rxjs';
import { IGenre } from '../models/genres.interface';
import { ILanguage } from '../models/language.interface';
import { INowPlayingMoviesResponse } from '../models/movie/movies-response.interface';
import { ViewportScroller } from '@angular/common';
import { ITV } from '../models/tv/tv.interface';
import { IFilters } from '../models/filters.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('SharedService', () => {
  let service: SharedService;
  let controller: HttpTestingController;

  const viewportMock = jasmine.createSpyObj('viewport', ['scrollToPosition']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SharedService,
        {
          provide: ViewportScroller,
          useValue: viewportMock,
        },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });

    service = TestBed.inject(SharedService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('setSearchSubject should set search$ to the provided value', fakeAsync(() => {
    service.search$.pipe(first()).subscribe((value) => {
      expect(value).toBe('query');
    });

    service.setSearchSubject('query');
    tick();
  }));

  it('setMediaTypeSubject should set mediaType$ to the provided value', fakeAsync(() => {
    service.mediaType$.pipe(first()).subscribe((value) => {
      expect(value).toBe('movie');
    });

    service.setMediaTypeSubject('movie');
    tick();
  }));

  describe('setGenresSubject', () => {
    const genre: IGenre[] = [{ id: 1, name: 'horror' }];

    it('should set provided movie genres to genres$', fakeAsync(() => {
      service.setGenresSubject(genre, 'movie');

      service.genres$.pipe(first()).subscribe((value) => {
        expect(value).toEqual({ movie: genre, tv: undefined });
      });
      tick();
    }));

    it('should set provided tv genres to genres$', fakeAsync(() => {
      service.setGenresSubject(genre, 'tv');

      service.genres$.pipe(first()).subscribe((value) => {
        expect(value).toEqual({ movie: undefined, tv: genre });
      });
      tick();
    }));
  });

  it('setLanguagesSubject should set languages$ to the provided value', fakeAsync(() => {
    const languages: ILanguage[] = [
      { english_name: 'en', iso_639_1: 'iso', name: 'English' },
    ];

    service.setLanguagesSubject(languages);

    service.languages$.pipe(first()).subscribe((value) => {
      expect(value).toBe(languages);
    });
    tick();
  }));

  it('scrollToTop should call scrollToPosition', () => {
    service.scrollToTop();

    expect(viewportMock.scrollToPosition).toHaveBeenCalledWith([0, 0]);
  });

  it('mediaTrackBy should return id', () => {
    expect(service.mediaTrackBy(1, { id: 123 } as ITV)).toBe(123);
  });

  it('setParams should set params and navigate correctly', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const filters: IFilters = {
      page: 2,
      include_adult: false,
      query: 'query',
      language: 'en',
      sort_by: 'first_air_date.asc',
      with_genres: 'genre',
    };

    service.setParams(filters, '/search', 'tv');

    expect(router.navigate).toHaveBeenCalledWith(['/search', 'tv'], {
      queryParams: filters,
    });
  });
});
