import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DiscoverComponent } from './discover.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IFilters } from '@app/shared/models/filters.interface';
import { IGenre } from '@app/shared/models/genres.interface';
import { MediaService } from '@app/shared/services/media/media.service';
import { SharedService } from '@app/shared/services/shared.service';
import { ILanguage } from '@app/shared/models/language.interface';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';

const filters: IFilters = {
  page: 1,
  sort_by: 'popularity.desc',
  with_genres: undefined,
  include_adult: false,
  language: undefined,
  'vote_average.gte': undefined,
  'vote_average.lte': undefined,
  first_air_date_year: undefined,
  primary_release_year: undefined,
};

describe('DiscoverComponent', () => {
  let fixture: ComponentFixture<DiscoverComponent>;
  let component: DiscoverComponent;

  let mockMediaService = jasmine.createSpyObj('mediaService', [
    'getGenres',
    'getLanguages',
  ]);
  let mockSharedService = {
    genres$: of({
      movie: <IGenre[]>[{ id: 1, name: 'horror' }],
      tv: undefined,
    }),
    languages$: of(<ILanguage[]>[
      { english_name: 'en', iso_639_1: 'iso', name: 'English' },
    ]),
    fetchDebounceTime: 1000,
    ...jasmine.createSpyObj('sharedService', [
      'scrollToTop',
      'setParams',
      'mediaTrackBy',
    ]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscoverComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatSelectModule,
        MatInputModule,
        MatPaginatorModule,
        MatCardModule,
      ],
      providers: [
        {
          provide: MediaService,
          useValue: mockMediaService,
        },
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverComponent);
    component = fixture.componentInstance;

    mockSharedService.setParams.calls.reset();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render movies', fakeAsync(() => {
    component.res$ = of(<{ movies: IMoviesResponse }>{
      movies: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 1,
      },
    });

    fixture.detectChanges();

    const moviesEl = fixture.debugElement.query(
      By.css('[data-testid="movies"]')
    );
    const tvsEl = fixture.debugElement.query(By.css('[data-testid="tvs"]'));
    expect(moviesEl).toBeTruthy();
    expect(tvsEl).toBeNull();
  }));

  it('should render tv series', fakeAsync(() => {
    component.res$ = of(<{ tvs: ITVsResponse }>{
      tvs: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 1,
      },
    });

    fixture.detectChanges();

    const tvsEl = fixture.debugElement.query(By.css('[data-testid="tvs"]'));
    const moviesEl = fixture.debugElement.query(
      By.css('[data-testid="movies"]')
    );
    expect(tvsEl).toBeTruthy();
    expect(moviesEl).toBeNull();
  }));

  it('should render no result element if there is no result', () => {
    component.noResult = true;
    fixture.detectChanges();
    const noResEl = fixture.debugElement.query(
      By.css('[data-testid="no-result"]')
    );
    expect(noResEl).toBeTruthy();
  });

  it('handlePageEvent should navigate to the specified page', fakeAsync(() => {
    component.mediaType = 'movie';

    component.handlePageEvent({ pageIndex: 1 } as PageEvent);
    tick();

    const params: IFilters = {
      ...filters,
      page: 2,
      include_adult: false,
      sort_by: 'popularity.desc',
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'movie'
    );
  }));

  it('should call setParams on sortByControl value changes', fakeAsync(() => {
    component.mediaType = 'tv';

    component.sortByControl.setValue('name.asc');
    tick(1000);

    const params: IFilters = {
      ...filters,
      sort_by: 'name.asc',
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'tv'
    );
  }));

  it('should call setParams on genreControl value changes', fakeAsync(() => {
    const genresSpy = spyOn<any>(component, 'fetchGenres').and.returnValue(
      of(<IGenre[]>[{ id: 1, name: 'horror' }])
    );

    component.ngOnInit();
    component.mediaType = 'movie';

    expect(genresSpy).toHaveBeenCalled();

    component.genreControl.setValue(['12', '74']);
    tick(1000);

    const params: IFilters = {
      ...filters,
      with_genres: '12,74',
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'movie'
    );
  }));

  it('should call setParams on includeAdultControl value changes', fakeAsync(() => {
    component.mediaType = 'tv';

    component.includeAdultControl.setValue(true);
    tick(1000);

    const params: IFilters = {
      ...filters,
      include_adult: true,
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'tv'
    );
  }));

  it('should call setParams on voteMaxControl value changes', fakeAsync(() => {
    component.mediaType = 'tv';
    component.voteMaxControl.setValue(5);
    tick(1000);

    const params: IFilters = {
      ...filters,
      'vote_average.gte': 0,
      'vote_average.lte': 5,
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'tv'
    );
  }));

  it('should call setParams on voteMinControl value changes', fakeAsync(() => {
    component.mediaType = 'tv';
    component.voteMinControl.setValue(5);
    tick(1000);

    const params: IFilters = {
      ...filters,
      'vote_average.gte': 5,
      'vote_average.lte': 10,
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'tv'
    );
  }));

  it("should call setParams on yearControl value changes with 'movie' mediaType", fakeAsync(() => {
    component.mediaType = 'movie';
    component.yearControl.setValue(2020);
    tick(1000);

    const params: IFilters = {
      ...filters,
      primary_release_year: 2020,
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'movie'
    );
  }));

  it("should call setParams on yearControl value changes with 'tv' mediaType", fakeAsync(() => {
    component.mediaType = 'tv';
    component.yearControl.setValue(1920);
    tick(1000);

    const params: IFilters = {
      ...filters,
      first_air_date_year: 1920,
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/discover',
      'tv'
    );
  }));

  // TODO: languageControl changes
});
