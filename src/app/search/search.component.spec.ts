import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getElementById } from 'src/testing';
import { of } from 'rxjs';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { SharedService } from '@app/shared/services/shared.service';
import { IGenre } from '@app/shared/models/genres.interface';
import { ILanguage } from '@app/shared/models/language.interface';
import { MediaType } from '@app/shared/models/media.type';
import { IFilters } from '@app/shared/models/filters.interface';
import { PageEvent } from '@angular/material/paginator';

const mockMediaRes = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 1,
};

const filters: IFilters = {
  page: 1,
  query: '',
  include_adult: false,
  language: '',
};

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;

  const mockSharedService = {
    genres$: of({
      movie: <IGenre[]>[{ id: 1, name: 'horror' }],
      tv: undefined,
    }),
    languages$: of(<ILanguage[]>[
      { english_name: 'en', iso_639_1: 'iso', name: 'English' },
    ]),
    mediaType$: of(<MediaType>'tv'),
    search$: of('query'),
    fetchDebounceTime: 1000,
    ...jasmine.createSpyObj('sharedService', [
      'scrollToTop',
      'setParams',
      'mediaTrackBy',
      'setMediaTypeSubject',
      'setLanguagesSubject',
    ]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatSelectModule,
      ],
      providers: [
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    mockSharedService.setParams.calls.reset();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render movies', () => {
    component.res$ = of(<{ movies: IMoviesResponse }>{
      movies: mockMediaRes,
    });

    fixture.detectChanges();

    const moviesEl = getElementById(fixture, 'movies');

    expect(moviesEl).toBeTruthy();
  });

  it('should render tv series', () => {
    component.res$ = of(<{ tvs: ITVsResponse }>{
      tvs: mockMediaRes,
    });

    fixture.detectChanges();

    const tvsEl = getElementById(fixture, 'tvs');

    expect(tvsEl).toBeTruthy();
  });

  it('should render tv series', () => {
    component.res$ = of(<{ people: IPeopleResponse }>{
      people: mockMediaRes,
    });

    fixture.detectChanges();

    const peopleEl = getElementById(fixture, 'people');

    expect(peopleEl).toBeTruthy();
  });

  it('should render no result element if there is no result', () => {
    component.noResult = true;
    fixture.detectChanges();

    const noResEl = getElementById(fixture, 'no-result');

    expect(noResEl).toBeTruthy();
  });

  it('should call setParams on includeAdultControl value changes', fakeAsync(() => {
    component.includeAdultControl.setValue(true);
    tick(1000);

    const params: IFilters = {
      ...filters,
      include_adult: true,
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/search',
      'tv'
    );
  }));

  it('should call setParams on languageControl value changes', fakeAsync(() => {
    component.mediaType = 'movie';

    component.languageControl.setValue('English');
    tick(1000);

    const params: IFilters = {
      ...filters,
      language: 'English',
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/search',
      'movie'
    );
  }));

  it('handlePageEvent should navigate to the specified page', fakeAsync(() => {
    component.mediaType = 'movie';

    component.handlePageEvent({ pageIndex: 1 } as PageEvent);
    tick();

    const params: IFilters = {
      ...filters,
      page: 2,
    };

    expect(mockSharedService.setParams).toHaveBeenCalledWith(
      params,
      '/search',
      'movie'
    );
  }));

  it('handleTabEvent should call setMediaTypeSubject', fakeAsync(() => {
    component.handleTabEvent(<MatButtonToggleChange>{ value: 'movie' });
    tick();

    expect(mockSharedService.setMediaTypeSubject).toHaveBeenCalledWith('movie');
  }));
});
