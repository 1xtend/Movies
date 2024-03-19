import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DetailsService } from './details.service';
import { TestBed } from '@angular/core/testing';
import { IDetailsPerson } from '@app/shared/models/person/person.interface';
import { errorResponse, expectError } from 'src/testing';
import {
  IDetailsTV,
  ILastEpisodeToAir,
} from '@app/shared/models/tv/tv.interface';
import {
  IBelongsToCollection,
  IDetailsMovie,
} from '@app/shared/models/movie/movie.interface';

const mockPersonDetails: IDetailsPerson = {
  adult: true,
  also_known_as: ['Bob'],
  biography: 'text',
  birthday: 'date',
  deathday: 'date',
  gender: 1,
  homepage: null,
  id: 123,
  imdb_id: '123',
  known_for_department: 'none',
  name: 'Bob',
  place_of_birth: 'USA',
  popularity: 123,
  profile_path: null,
};

const mockTVDetails: IDetailsTV = {
  adult: true,
  id: 123,
  name: 'Bob',
  popularity: 123,
  backdrop_path: null,
  created_by: [],
  episode_run_time: [],
  first_air_date: 'date',
  genres: [],
  homepage: 'page',
  in_production: false,
  languages: [],
  last_air_date: 'date',
  last_episode_to_air: {} as ILastEpisodeToAir,
  networks: [],
  next_episode_to_air: null,
  number_of_episodes: 1,
  number_of_seasons: 1,
  origin_country: [],
  original_language: 'en',
  original_name: 'Bob',
  overview: 'text',
  poster_path: null,
  production_companies: [],
  production_countries: [],
  seasons: [],
  spoken_languages: [],
  status: 'released',
  tagline: 'line',
  type: 'type',
  vote_average: 1,
  vote_count: 1,
  reviews: undefined,
  similar: undefined,
};

const mockMovieDetails: IDetailsMovie = {
  adult: true,
  id: 123,
  title: 'Bob',
  popularity: 123,
  backdrop_path: null,
  genres: [],
  original_language: 'en',
  overview: 'text',
  poster_path: null,
  production_companies: [],
  production_countries: [],
  spoken_languages: [],
  status: 'released',
  tagline: 'line',
  vote_average: 1,
  vote_count: 1,
  reviews: undefined,
  belongs_to_collection: {} as IBelongsToCollection,
  budget: 1,
  homepage: 'page',
  imdb_id: '123',
  original_title: 'Bob',
  release_date: 'date',
  revenue: 1,
  runtime: 123,
  video: false,
  similar: undefined,
};

fdescribe('DetailsService', () => {
  let service: DetailsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetailsService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(DetailsService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getPersonDetails', () => {
    let url: string;

    beforeEach(() => {
      url = '/person/123?append_to_response=images';
    });

    it('should return person details', () => {
      service.getPersonDetails(123).subscribe((res) => {
        expect(res).toEqual(mockPersonDetails);
      });

      const request = controller.expectOne(url);
      request.flush(mockPersonDetails);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getPersonDetails(123).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('getTVDetails', () => {
    let url: string;

    beforeEach(() => {
      url = '/tv/123?append_to_response=similar,reviews';
    });

    it('should return tv details', () => {
      service.getTVDetails(123).subscribe((res) => {
        expect(res).toEqual(mockTVDetails);
      });

      const request = controller.expectOne(url);
      request.flush(mockTVDetails);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getTVDetails(123).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });

  describe('getMovieDetails', () => {
    let url: string;

    beforeEach(() => {
      url = '/movie/123?append_to_response=similar,reviews';
    });

    it('should return movie details', () => {
      service.getMovieDetails(123).subscribe((res) => {
        expect(res).toEqual(mockMovieDetails);
      });

      const request = controller.expectOne(url);
      request.flush(mockMovieDetails);

      expect(request.request.method).toBe('GET');
    });

    it('should handle error if fails', () => {
      service.getMovieDetails(123).subscribe({
        error: (err) => {
          expectError(err);
        },
      });

      const request = controller.expectOne(url);
      request.error(new ProgressEvent('Error'), errorResponse);
    });
  });
});
