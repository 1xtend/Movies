import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { INowPlayingMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { of } from 'rxjs';
import { SharedService } from '@app/shared/services/shared.service';
import { By, Title } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ListsService } from '@app/shared/services/media/lists.service';

const mockMediaResponse = {
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

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  const mockListsService = {
    ...jasmine.createSpyObj('listsService', [
      'setPopularPeople',
      'setPopularMovies',
      'setPopularTVs',
      'setTopRatedMovies',
      'setOnTheAirTVs',
      'setNowPlayingMovies',
    ]),
    popularMovies$: of(mockMediaResponse),
    popularTVs$: of(mockMediaResponse),
    popularPeople$: of(mockMediaResponse),
    nowPlayingMovies$: of(mockNowPlayingMoviesRes),
    topRatedMovies$: of(mockMediaResponse),
    onTheAirTV$: of(mockMediaResponse),
  };
  const mockTitleService = jasmine.createSpyObj('titleService', ['setTitle']);
  const mockSharedService = jasmine.createSpyObj('sharedService', [
    'mediaTrackBy',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ListsService,
          useValue: mockListsService,
        },
        {
          provide: Title,
          useValue: mockTitleService,
        },
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title', () => {
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(
      'VMTV: Place for Movies and TV Series'
    );
  });

  it('should render popular movies section if they exist', () => {
    const section = fixture.debugElement.query(
      By.css('[data-testid="popular-movies"]')
    );

    console.log(section.nativeElement);

    expect(section).toBeTruthy();
  });

  it('should render popular tv series section if they exist', () => {
    const section = fixture.debugElement.query(
      By.css('[data-testid="popular-tvs"]')
    );

    console.log(section.nativeElement);

    expect(section).toBeTruthy();
  });

  it('should render popular people section if they exist', () => {
    const section = fixture.debugElement.query(
      By.css('[data-testid="popular-people"]')
    );

    console.log(section.nativeElement);

    expect(section).toBeTruthy();
  });

  it('should render now playing movies section if they exist', () => {
    const section = fixture.debugElement.query(
      By.css('[data-testid="now-playing-movies"]')
    );

    console.log(section.nativeElement);

    expect(section).toBeTruthy();
  });

  it('should render top rated movies section if they exist', () => {
    const section = fixture.debugElement.query(
      By.css('[data-testid="top-rated-movies"]')
    );

    console.log(section.nativeElement);

    expect(section).toBeTruthy();
  });

  it('should render on the air tv series section if they exist', () => {
    const section = fixture.debugElement.query(
      By.css('[data-testid="on-the-air-tvs"]')
    );

    console.log(section.nativeElement);

    expect(section).toBeTruthy();
  });
});
