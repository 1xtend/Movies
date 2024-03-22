import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { getElementById, mockImgData } from 'src/testing';
import { By } from '@angular/platform-browser';
import { TimePipe } from '@app/shared/pipes/time.pipe';
import { TvDetailsComponent } from './tv-details.component';
import {
  IDetailsTV,
  ILastEpisodeToAir,
} from '@app/shared/models/tv/tv.interface';

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

@Component({
  selector: 'app-image-enlarger',
})
class ImageEnlargerMockComponent {}

describe('TvDetailsComponent', () => {
  let fixture: ComponentFixture<TvDetailsComponent>;
  let component: TvDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TvDetailsComponent, TimePipe, ImageEnlargerMockComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TvDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image enlarger if poster_path is provided', () => {
    component.tv = {
      ...mockTVDetails,
      poster_path: mockImgData.src,
    };
    fixture.detectChanges();

    const enlargerEl = fixture.debugElement.query(
      By.directive(ImageEnlargerMockComponent)
    );
    expect(enlargerEl).toBeTruthy();
  });

  it('should render noImage template if poster_path is not provided', () => {
    component.tv = {
      ...mockTVDetails,
      poster_path: null,
    };
    fixture.detectChanges();

    const noImageEl = getElementById(fixture, 'no-image');
    expect(noImageEl).toBeTruthy();
  });

  it('should render main title with link inside if homepage is provided', () => {
    component.tv = {
      ...mockTVDetails,
      homepage: 'https://google.com/',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const linkEl = getElementById(titleEl, 'main-title-link');

    expect(linkEl.attributes['href']).toBe(component.tv.homepage);
    expect(linkEl.nativeElement.textContent.trim()).toBe(component.tv.name);
  });

  it('should render main title with provided title', () => {
    component.tv = {
      ...mockTVDetails,
      homepage: '',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const innerEl = getElementById(titleEl, 'main-title-inner');

    expect(innerEl.nativeElement.textContent.trim()).toBe(component.tv.name);
  });

  it('should render main title with year span inside if release_date provided', () => {
    component.tv = {
      ...mockTVDetails,
      first_air_date: '05.05.1995',
      last_air_date: '06.06.2006',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const innerEl = getElementById(titleEl, 'main-title-year');

    expect(innerEl.nativeElement.textContent.trim()).toBe('(1995 - 2006)');
  });

  it('should render tagline if provided', () => {
    component.tv = {
      ...mockTVDetails,
      tagline: 'Cool tagline',
    };
    fixture.detectChanges();

    const taglineEl = getElementById(fixture, 'tagline');

    expect(taglineEl.nativeElement.textContent.trim()).toBe('Cool tagline');
  });

  it('should render overview if provided', () => {
    component.tv = {
      ...mockTVDetails,
      overview: 'Long text',
    };
    fixture.detectChanges();

    const overviewEl = getElementById(fixture, 'overview');

    expect(overviewEl.nativeElement.textContent.trim()).toBe('Long text');
  });

  it('should render genres if provided', () => {
    component.tv = {
      ...mockTVDetails,
      genres: [
        { id: 1, name: 'horror' },
        { id: 2, name: 'fantasy' },
      ],
    };
    fixture.detectChanges();

    const genresEl = getElementById(fixture, 'genres');

    expect(genresEl.nativeElement.textContent.trim()).toBe('horror, fantasy');
  });

  it('should render first air date if provided', () => {
    component.tv = {
      ...mockTVDetails,
      first_air_date: '01.01.2001',
    };
    fixture.detectChanges();

    const releaseDateEl = getElementById(fixture, 'first-air-date');

    expect(releaseDateEl.nativeElement.textContent.trim()).toBe('01/01/2001');
  });

  it('should render last air date if provided', () => {
    component.tv = {
      ...mockTVDetails,
      last_air_date: '02.02.2002',
    };
    fixture.detectChanges();

    const releaseDateEl = getElementById(fixture, 'last-air-date');

    expect(releaseDateEl.nativeElement.textContent.trim()).toBe('02/02/2002');
  });

  it('should render status if provided', () => {
    component.tv = {
      ...mockTVDetails,
      status: 'released',
    };
    fixture.detectChanges();

    const statusEl = getElementById(fixture, 'status');

    expect(statusEl.nativeElement.textContent.trim()).toBe('released');
  });

  it('should render similar section if provided', () => {
    component.tv = {
      ...mockTVDetails,
      similar: { page: 1, results: [], total_pages: 1, total_results: 1 },
    };
    fixture.detectChanges();

    const similarEl = getElementById(fixture, 'similar');

    expect(similarEl).toBeTruthy();
  });

  it('should render similar accordion if provided', () => {
    component.tv = {
      ...mockTVDetails,
      reviews: { page: 1, results: [], total_pages: 1, total_results: 1 },
    };
    fixture.detectChanges();

    const reviewsEl = getElementById(fixture, 'reviews');

    expect(reviewsEl).toBeTruthy();
  });
});
