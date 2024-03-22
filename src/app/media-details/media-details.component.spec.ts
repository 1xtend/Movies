import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaDetailsComponent } from './media-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IDetailsMovie } from '@app/shared/models/movie/movie.interface';
import { By } from '@angular/platform-browser';
import {
  IDetailsTV,
  ILastEpisodeToAir,
} from '@app/shared/models/tv/tv.interface';
import { IDetailsPerson } from '@app/shared/models/person/person.interface';

const mockMovieDetails: IDetailsMovie = {
  adult: true,
  backdrop_path: null,
  budget: 1,
  genres: [],
  homepage: 'page',
  id: 1,
  imdb_id: '123',
  original_language: 'English',
  original_title: 'Bob',
  overview: 'Long text...',
  popularity: 9,
  poster_path: null,
  release_date: '03.03.2003',
  revenue: 100,
  runtime: 126,
  spoken_languages: [],
  status: 'released',
  tagline: 'cool tagline',
  title: 'Bob',
  video: false,
  vote_average: 7,
  vote_count: 2,
  production_countries: [],
  production_companies: [],
  belongs_to_collection: {
    backdrop_path: null,
    id: 1,
    name: 'Collection',
    poster_path: null,
  },
};

const mockTVDetails: IDetailsTV = {
  adult: true,
  backdrop_path: null,
  genres: [],
  homepage: 'page',
  id: 1,
  original_language: 'English',
  overview: 'Long text...',
  popularity: 9,
  poster_path: null,
  spoken_languages: [],
  status: 'released',
  tagline: 'cool tagline',
  vote_average: 7,
  vote_count: 2,
  production_countries: [],
  production_companies: [],
  created_by: [],
  episode_run_time: [],
  first_air_date: '01.01.1991',
  in_production: true,
  languages: [],
  last_air_date: '04.04.2004',
  last_episode_to_air: {} as ILastEpisodeToAir,
  name: 'Bob',
  networks: [],
  next_episode_to_air: null,
  number_of_episodes: 1,
  number_of_seasons: 1,
  origin_country: [],
  original_name: 'Bob',
  seasons: [],
  type: 'tv show',
};

const mockPersonDetails: IDetailsPerson = {
  adult: true,
  id: 1,
  imdb_id: '123',
  popularity: 9,
  also_known_as: [],
  biography: 'long text',
  birthday: '01.01.1991',
  deathday: '02.02.1992',
  gender: 1,
  homepage: null,
  known_for_department: '',
  name: 'Bob',
  place_of_birth: 'USA',
  profile_path: null,
};

@Component({
  selector: 'app-movie-details',
  template: '',
})
class MovieDetailsMockComponent {
  @Input() movie!: IDetailsMovie;
  @Input() posterPath!: string;
  @Input() original!: string;
  @Input() language?: string;
  @Input() slides$?: Observable<number>;
}

@Component({
  selector: 'app-tv-details',
})
class TvDetailsMockComponent {
  @Input() tv!: IDetailsTV;
  @Input() posterPath!: string;
  @Input() original!: string;
  @Input() language?: string;
  @Input() slides$?: Observable<number>;
}

@Component({
  selector: 'app-person-details',
})
class PersonDetailsMockComponent {
  @Input() person!: IDetailsPerson;
  @Input() profilePath!: string;
  @Input() original!: string;
  @Input() slides$?: Observable<number>;
}

describe('MediaDetailsComponent', () => {
  let fixture: ComponentFixture<MediaDetailsComponent>;
  let component: MediaDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MediaDetailsComponent,
        MovieDetailsMockComponent,
        TvDetailsMockComponent,
        PersonDetailsMockComponent,
      ],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render movie-details component when res$ contains movie', () => {
    component.res$ = of({
      movie: mockMovieDetails,
      person: undefined,
      tv: undefined,
    });

    fixture.detectChanges();

    const movieEl = fixture.debugElement.query(
      By.directive(MovieDetailsMockComponent)
    );

    expect(movieEl).toBeTruthy();
  });

  it('should render tv-details component when res$ contains tv', () => {
    component.res$ = of({
      movie: undefined,
      person: undefined,
      tv: mockTVDetails,
    });

    fixture.detectChanges();

    const tvEl = fixture.debugElement.query(
      By.directive(TvDetailsMockComponent)
    );

    expect(tvEl).toBeTruthy();
  });

  it('should render person-details component when res$ contains person', () => {
    component.res$ = of({
      movie: undefined,
      person: mockPersonDetails,
      tv: undefined,
    });

    fixture.detectChanges();

    const personEl = fixture.debugElement.query(
      By.directive(PersonDetailsMockComponent)
    );

    expect(personEl).toBeTruthy();
  });
});
