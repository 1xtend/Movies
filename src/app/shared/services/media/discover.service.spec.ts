import { TestBed } from '@angular/core/testing';
import { DiscoverService } from './discover.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { errorResponse, expectError, getUrl, mockFilters } from 'src/testing';

const mockDiscoverRes = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 1,
};

fdescribe('DiscoverService', () => {
  let service: DiscoverService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscoverService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(DiscoverService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('discoverMovies', () => {
    let url: string;

    beforeEach(() => {
      url = getUrl('/discover', 'movie', mockFilters);
    });

    it('should return discover movies', () => {
      service.discoverMovies(mockFilters).subscribe((res) => {
        expect(res).toEqual(mockDiscoverRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockDiscoverRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.discoverMovies(mockFilters).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('discoverTVs', () => {
    let url: string;

    beforeEach(() => {
      url = getUrl('/discover', 'tv', mockFilters);
    });

    it('should return discover tv series', () => {
      service.discoverTVs(mockFilters).subscribe((res) => {
        expect(res).toEqual(mockDiscoverRes);
      });

      const request = controller.expectOne(url);
      request.flush(mockDiscoverRes);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.discoverTVs(mockFilters).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });
});
