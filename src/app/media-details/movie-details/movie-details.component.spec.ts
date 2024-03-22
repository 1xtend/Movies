import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailsComponent } from './movie-details.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { getElementById, mockImgData } from 'src/testing';
import { IDetailsMovie } from '@app/shared/models/movie/movie.interface';
import { By } from '@angular/platform-browser';
import { TimePipe } from '@app/shared/pipes/time.pipe';

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

@Component({
  selector: 'app-image-enlarger',
})
class ImageEnlargerMockComponent {}

describe('MovieDetailsComponent', () => {
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let component: MovieDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MovieDetailsComponent,
        TimePipe,
        ImageEnlargerMockComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image enlarger if poster_path is provided', () => {
    component.movie = {
      ...mockMovieDetails,
      poster_path: mockImgData.src,
    };
    fixture.detectChanges();

    const enlargerEl = fixture.debugElement.query(
      By.directive(ImageEnlargerMockComponent)
    );
    expect(enlargerEl).toBeTruthy();
  });

  it('should render noImage template if poster_path is not provided', () => {
    component.movie = {
      ...mockMovieDetails,
      poster_path: null,
    };
    fixture.detectChanges();

    const noImageEl = getElementById(fixture, 'no-image');
    expect(noImageEl).toBeTruthy();
  });

  it('should render main title with link inside if homepage is provided', () => {
    component.movie = {
      ...mockMovieDetails,
      homepage: 'https://google.com/',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const linkEl = getElementById(titleEl, 'main-title-link');

    expect(linkEl.attributes['href']).toBe(component.movie.homepage);
    expect(linkEl.nativeElement.textContent.trim()).toBe(component.movie.title);
  });

  it('should render main title with provided title', () => {
    component.movie = {
      ...mockMovieDetails,
      homepage: '',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const innerEl = getElementById(titleEl, 'main-title-inner');

    expect(innerEl.nativeElement.textContent.trim()).toBe(
      component.movie.title
    );
  });

  it('should render main title with year span inside if release_date provided', () => {
    component.movie = {
      ...mockMovieDetails,
      release_date: '05.05.1995',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const innerEl = getElementById(titleEl, 'main-title-release-date');

    expect(innerEl.nativeElement.textContent.trim()).toBe('(1995)');
  });

  it('should render tagline if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      tagline: 'Cool tagline',
    };
    fixture.detectChanges();

    const taglineEl = getElementById(fixture, 'tagline');

    expect(taglineEl.nativeElement.textContent.trim()).toBe('Cool tagline');
  });

  it('should render overview if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      overview: 'Long text',
    };
    fixture.detectChanges();

    const overviewEl = getElementById(fixture, 'overview');

    expect(overviewEl.nativeElement.textContent.trim()).toBe('Long text');
  });

  it('should render overview if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      genres: [
        { id: 1, name: 'horror' },
        { id: 2, name: 'fantasy' },
      ],
    };
    fixture.detectChanges();

    const genresEl = getElementById(fixture, 'genres');

    expect(genresEl.nativeElement.textContent.trim()).toBe('horror, fantasy');
  });

  it('should render release date if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      release_date: '01.01.2001',
    };
    fixture.detectChanges();

    const releaseDateEl = getElementById(fixture, 'release-date');

    expect(releaseDateEl.nativeElement.textContent.trim()).toBe('01/01/2001');
  });

  it('should render runtime if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      runtime: 112,
    };
    fixture.detectChanges();

    const runtimeEl = getElementById(fixture, 'runtime');

    expect(runtimeEl.nativeElement.textContent.trim()).toBe('1h 52m');
  });

  it('should render status if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      status: 'released',
    };
    fixture.detectChanges();

    const statusEl = getElementById(fixture, 'status');

    expect(statusEl.nativeElement.textContent.trim()).toBe('released');
  });

  it('should render original title if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      original_title: 'long title',
    };
    fixture.detectChanges();

    const originalTitleEl = getElementById(fixture, 'original-title');

    expect(originalTitleEl.nativeElement.textContent.trim()).toBe('long title');
  });

  it('should render budget if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      budget: 200,
    };
    fixture.detectChanges();

    const budgetEl = getElementById(fixture, 'budget');

    expect(budgetEl.nativeElement.textContent.trim()).toBe('$200.00');
  });

  it('should render revenue if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      revenue: 300,
    };
    fixture.detectChanges();

    const revenueEl = getElementById(fixture, 'revenue');

    expect(revenueEl.nativeElement.textContent.trim()).toBe('$300.00');
  });

  it('should render revenue if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      revenue: 300,
    };
    fixture.detectChanges();

    const revenueEl = getElementById(fixture, 'revenue');

    expect(revenueEl.nativeElement.textContent.trim()).toBe('$300.00');
  });

  it('should render similar section if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      similar: { page: 1, results: [], total_pages: 1, total_results: 1 },
    };
    fixture.detectChanges();

    const similarEl = getElementById(fixture, 'similar');

    expect(similarEl).toBeTruthy();
  });

  it('should render similar accordion if provided', () => {
    component.movie = {
      ...mockMovieDetails,
      reviews: { page: 1, results: [], total_pages: 1, total_results: 1 },
    };
    fixture.detectChanges();

    const reviewsEl = getElementById(fixture, 'reviews');

    expect(reviewsEl).toBeTruthy();
  });
});
