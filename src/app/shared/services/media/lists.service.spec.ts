import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ListsService } from './lists.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { errorResponse, expectError } from 'src/testing';
import { INowPlayingMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { first } from 'rxjs';

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

  it('setPopularMovies should fetch popular movies if they are undefined', fakeAsync(() => {
    service.setPopularMovies();

    const request = controller.expectOne('/movie/popular');
    request.flush(mockMediaRes);

    expect(request.request.method).toBe('GET');

    service.popularMovies$.pipe(first()).subscribe((value) => {
      expect(value).toEqual(mockMediaRes);
    });
    tick();
  }));

  it('setPopularTVs should fetch popular tv series if they are undefined', fakeAsync(() => {
    service.setPopularTVs();

    const request = controller.expectOne('/tv/popular');
    request.flush(mockMediaRes);

    expect(request.request.method).toBe('GET');

    service.popularTVs$.pipe(first()).subscribe((value) => {
      expect(value).toEqual(mockMediaRes);
    });
    tick();
  }));

  it('setPopularPeople should fetch popular people if they are undefined', fakeAsync(() => {
    service.setPopularPeople();

    const request = controller.expectOne('/person/popular');
    request.flush(mockMediaRes);

    expect(request.request.method).toBe('GET');

    service.popularPeople$.pipe(first()).subscribe((value) => {
      expect(value).toEqual(mockMediaRes);
    });
    tick();
  }));

  it('setNowPlayingMovies should fetch now playing movies if they are undefined', fakeAsync(() => {
    service.setNowPlayingMovies();

    const request = controller.expectOne('/movie/now_playing');
    request.flush(mockNowPlayingMoviesRes);

    expect(request.request.method).toBe('GET');

    service.nowPlayingMovies$.pipe(first()).subscribe((value) => {
      expect(value).toEqual(mockNowPlayingMoviesRes);
    });
    tick();
  }));

  it('setTopRatedMovies should fetch top rated movies if they are undefined', fakeAsync(() => {
    service.setTopRatedMovies();

    const request = controller.expectOne('/movie/top_rated');
    request.flush(mockMediaRes);

    expect(request.request.method).toBe('GET');

    service.topRatedMovies$.pipe(first()).subscribe((value) => {
      expect(value).toEqual(mockMediaRes);
    });
    tick();
  }));

  it('setOnTheAirTVs should fetch on the air tv series if they are undefined', fakeAsync(() => {
    service.setOnTheAirTVs();

    const request = controller.expectOne('/tv/on_the_air');
    request.flush(mockMediaRes);

    expect(request.request.method).toBe('GET');

    service.onTheAirTV$.pipe(first()).subscribe((value) => {
      expect(value).toEqual(mockMediaRes);
    });
    tick();
  }));
});
