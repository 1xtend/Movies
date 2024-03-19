import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ListsService } from './lists.service';
import { TestBed } from '@angular/core/testing';
import { errorResponse, expectError } from 'src/testing';
import { INowPlayingMoviesResponse } from '@app/shared/models/movie/movies-response.interface';

const mockMediaRes = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 1,
};

const mockNowPlayingMoviesRes: INowPlayingMoviesResponse = {
  dates: {
    maximum: '1',
    minimum: '0',
  },
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 1,
};

describe('ListsService', () => {
  let service: ListsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListsService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ListsService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getPopularMovies', () => {
    let url: string;

    beforeEach(() => {
      url = '/movie/popular';
    });

    it('should return popular movies', () => {
      service.getPopularMovies().subscribe((res) => {
        expect(res).toEqual(mockMediaRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockMediaRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getPopularMovies().subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('getPopularTVs', () => {
    let url: string;

    beforeEach(() => {
      url = '/tv/popular';
    });

    it('should return popular tv series', () => {
      service.getPopularTVs().subscribe((res) => {
        expect(res).toEqual(mockMediaRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockMediaRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getPopularTVs().subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('getPopularPeople', () => {
    let url: string;

    beforeEach(() => {
      url = '/person/popular';
    });

    it('should return popular people', () => {
      service.getPopularPeople().subscribe((res) => {
        expect(res).toEqual(mockMediaRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockMediaRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getPopularPeople().subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('getNowPlayingMovies', () => {
    let url: string;

    beforeEach(() => {
      url = '/movie/now_playing';
    });

    it('should return now playing movies', () => {
      service.getNowPlayingMovies().subscribe((res) => {
        expect(res).toEqual(mockNowPlayingMoviesRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockNowPlayingMoviesRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getNowPlayingMovies().subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('getTopRatedMovies', () => {
    let url: string;

    beforeEach(() => {
      url = '/movie/top_rated';
    });

    it('should return top rated movies', () => {
      service.getTopRatedMovies().subscribe((res) => {
        expect(res).toEqual(mockMediaRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockMediaRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getTopRatedMovies().subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('getOnTheAirTV', () => {
    let url: string;

    beforeEach(() => {
      url = '/tv/on_the_air';
    });

    it('should return on the air tv series', () => {
      service.getOnTheAirTV().subscribe((res) => {
        expect(res).toEqual(mockMediaRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockMediaRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getOnTheAirTV().subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });
});
