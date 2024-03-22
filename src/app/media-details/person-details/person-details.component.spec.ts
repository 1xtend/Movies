import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { getElementById, mockImgData } from 'src/testing';
import { By } from '@angular/platform-browser';
import { TimePipe } from '@app/shared/pipes/time.pipe';
import { PersonDetailsComponent } from './person-details.component';
import { IDetailsPerson } from '@app/shared/models/person/person.interface';

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
  selector: 'app-image-enlarger',
})
class ImageEnlargerMockComponent {}

describe('PersonDetailsComponent', () => {
  let fixture: ComponentFixture<PersonDetailsComponent>;
  let component: PersonDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PersonDetailsComponent,
        TimePipe,
        ImageEnlargerMockComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image enlarger if profile_path is provided', () => {
    component.person = {
      ...mockPersonDetails,
      profile_path: mockImgData.src,
    };
    fixture.detectChanges();

    const enlargerEl = fixture.debugElement.query(
      By.directive(ImageEnlargerMockComponent)
    );
    expect(enlargerEl).toBeTruthy();
  });

  it('should render noImage template if profile_path is not provided', () => {
    component.person = {
      ...mockPersonDetails,
      profile_path: null,
    };
    fixture.detectChanges();

    const noImageEl = getElementById(fixture, 'no-image');
    expect(noImageEl).toBeTruthy();
  });

  it('should render main title with link inside if homepage is provided', () => {
    component.person = {
      ...mockPersonDetails,
      homepage: 'https://google.com/',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const linkEl = getElementById(titleEl, 'main-title-link');

    expect(linkEl.attributes['href']).toBe(component.person.homepage);
    expect(linkEl.nativeElement.textContent.trim()).toBe(component.person.name);
  });

  it('should render main title with provided title', () => {
    component.person = {
      ...mockPersonDetails,
      homepage: '',
    };
    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'main-title');
    const innerEl = getElementById(titleEl, 'main-title-inner');

    expect(innerEl.nativeElement.textContent.trim()).toBe(
      component.person.name
    );
  });

  it('should render biography if provided', () => {
    component.person = {
      ...mockPersonDetails,
      biography: 'long text',
    };
    fixture.detectChanges();

    const biographyEl = getElementById(fixture, 'biography');

    expect(biographyEl.nativeElement.textContent.trim()).toBe('long text');
  });

  it('should render also known as if provided', () => {
    component.person = {
      ...mockPersonDetails,
      also_known_as: ['john', 'kevin'],
    };
    fixture.detectChanges();

    const alsoKnownAsEl = getElementById(fixture, 'also-known-as');

    expect(alsoKnownAsEl.nativeElement.textContent.trim()).toBe('john; kevin');
  });

  it('should render birthday if provided', () => {
    component.person = {
      ...mockPersonDetails,
      birthday: '01.01.2001',
    };
    fixture.detectChanges();

    const birthdayEl = getElementById(fixture, 'birthday');

    expect(birthdayEl.nativeElement.textContent.trim()).toBe('01/01/2001');
  });

  it('should render deathday if provided', () => {
    component.person = {
      ...mockPersonDetails,
      deathday: '02.02.2002',
    };
    fixture.detectChanges();

    const deathdayEl = getElementById(fixture, 'deathday');

    expect(deathdayEl.nativeElement.textContent.trim()).toBe('02/02/2002');
  });

  it('should render place of birth if provided', () => {
    component.person = {
      ...mockPersonDetails,
      place_of_birth: 'USA',
    };
    fixture.detectChanges();

    const placeOfBirthEl = getElementById(fixture, 'place-of-birth');

    expect(placeOfBirthEl.nativeElement.textContent.trim()).toBe('USA');
  });

  it('should render gender if provided', () => {
    component.person = {
      ...mockPersonDetails,
      gender: 2,
    };
    fixture.detectChanges();

    const genderEl = getElementById(fixture, 'gender');

    expect(genderEl.nativeElement.textContent.trim()).toBe('Male');
  });

  it('should render known for department if provided', () => {
    component.person = {
      ...mockPersonDetails,
      known_for_department: 'acting',
    };
    fixture.detectChanges();

    const knownForDepartmentEl = getElementById(
      fixture,
      'known-for-department'
    );

    expect(knownForDepartmentEl.nativeElement.textContent.trim()).toBe(
      'acting'
    );
  });

  it('should render images section if provided', () => {
    component.person = {
      ...mockPersonDetails,
      images: {
        profiles: [
          {
            aspect_ratio: 1,
            file_path: mockImgData.src,
            height: 100,
            iso_639_1: null,
            vote_average: 1,
            vote_count: 1,
            width: 100,
          },
        ],
      },
    };
    fixture.detectChanges();

    const imagesEl = getElementById(fixture, 'images');

    expect(imagesEl).toBeTruthy();
  });
});
