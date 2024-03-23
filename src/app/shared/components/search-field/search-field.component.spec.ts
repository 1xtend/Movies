import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SearchFieldComponent } from './search-field.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '@app/shared/services/shared.service';
import { Router } from '@angular/router';
import { getElementById } from 'src/testing';

describe('SearchFieldComponent', () => {
  let fixture: ComponentFixture<SearchFieldComponent>;
  let component: SearchFieldComponent;

  let router: Router;
  let navigateSpy: jasmine.Spy;

  const mockSharedService = jasmine.createSpyObj('sharedService', [
    'setSearchSubject',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFieldComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFieldComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');

    mockSharedService.setSearchSubject.calls.reset();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setSearchSubject on searchControl value changes and navigate to search route', fakeAsync(() => {
    component.searchControl.setValue(' hulk  ');
    tick(500);

    expect(mockSharedService.setSearchSubject).toHaveBeenCalledWith('hulk');
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/search', 'tv'], {
      queryParams: {
        query: 'hulk',
        page: 1,
      },
    });
  }));

  it('should not call setSearchSubject on searchControl value changes if query is empty', fakeAsync(() => {
    component.searchControl.setValue('');
    tick(500);

    expect(mockSharedService.setSearchSubject).not.toHaveBeenCalled();
  }));

  it('should reset input by click on reset button', fakeAsync(() => {
    const inputEl = getElementById(fixture, 'search-input');
    inputEl.triggerEventHandler('input', { target: { value: 'hulk' } });
    tick(500);

    fixture.detectChanges();

    const buttonEl = getElementById(fixture, 'reset-button');
    expect(buttonEl).toBeTruthy();

    buttonEl.triggerEventHandler('click', null);
    tick(500);

    expect(component.searchControl.value).toBeNull();
  }));
});
