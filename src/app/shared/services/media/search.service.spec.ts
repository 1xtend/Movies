import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SearchService } from './search.service';
import { TestBed } from '@angular/core/testing';
import { errorResponse, expectError, getUrl, mockFilters } from 'src/testing';

const mockSearchRes = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 1,
};

describe('SearchService', () => {
  let service: SearchService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(SearchService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('searchPeople', () => {
    let url: string;

    beforeEach(() => {
      url = getUrl('/search', 'person', mockFilters);
    });

    it('should return people', () => {
      service.searchPeople(mockFilters).subscribe((res) => {
        expect(res).toEqual(mockSearchRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockSearchRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.searchPeople(mockFilters).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('searchTV', () => {
    let url: string;

    beforeEach(() => {
      url = getUrl('/search', 'tv', mockFilters);
    });

    it('should return tv series', () => {
      service.searchTV(mockFilters).subscribe((res) => {
        expect(res).toEqual(mockSearchRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockSearchRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.searchTV(mockFilters).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('searchMovies', () => {
    let url: string;

    beforeEach(() => {
      url = getUrl('/search', 'movie', mockFilters);
    });

    it('should return movies', () => {
      service.searchMovie(mockFilters).subscribe((res) => {
        expect(res).toEqual(mockSearchRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockSearchRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.searchMovie(mockFilters).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });
});
