import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MediaCardComponent } from './media-card.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';

import { RouterTestingModule } from '@angular/router/testing';
import { TextCutPipe } from '@app/shared/pipes/text-cut.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MediaType } from '@app/shared/models/media.type';

@Component({
  template: `<app-media-card
    [mediaType]="mediaType"
    [imagePath]="imagePath"
    [voteAverage]="voteAverage"
    [releaseDate]="releaseDate"
    [title]="title"
    [id]="id"
    [titleSize]="titleSize"
    [textCut]="textCut"
    [language]="language"
  ></app-media-card>`,
})
class TestHostComponent implements Partial<MediaCardComponent> {
  mediaType!: MediaType;
  imagePath: string | null = '';
  voteAverage? = 0;
  releaseDate? = '';
  title = '';
  id = 0;
  titleSize?: number;
  textCut?: number;
  language?: string;
}

describe('MediaCardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: MediaCardComponent;
  let hostComponent: TestHostComponent;
  let hostElement: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MediaCardComponent, TestHostComponent, TextCutPipe],
      imports: [MatCardModule, RouterTestingModule, MatTooltipModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    hostElement = fixture.debugElement.query(By.directive(MediaCardComponent));
    component = hostElement.injector.get(MediaCardComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render router links with correct attributes', () => {
    const id = 123;
    const type: MediaType = 'movie';
    const language = 'en';

    hostComponent.id = id;
    hostComponent.mediaType = type;
    fixture.detectChanges();

    const linkEls = hostElement.queryAll(By.css('[data-testid="router-link"]'));

    linkEls.forEach((el) => {
      expect(el.attributes['href']).toBe(`/details/${type}/${id}`);
    });

    hostComponent.language = 'en';
    fixture.detectChanges();

    linkEls.forEach((el) => {
      expect(el.attributes['href']).toBe(
        `/details/${type}/${id}?language=${language}`
      );
    });
  });

  it('should render person-card when mediaType is a person', () => {
    hostComponent.mediaType = 'person';
    fixture.detectChanges();

    const cardEl = hostElement.query(By.css('[data-testid="person-card"]'));

    expect(cardEl).toBeTruthy();
  });

  it('should render show-card when mediaType is not a person', () => {
    hostComponent.mediaType = 'movie';
    fixture.detectChanges();

    const cardEl = hostElement.query(By.css('[data-testid="show-card"]'));

    expect(hostComponent.mediaType).not.toBe('person');
    expect(cardEl).toBeTruthy();
  });

  it('should cut title if textCut input is provided', () => {
    hostComponent.title = 'title example';
    hostComponent.textCut = 5;
    hostComponent.mediaType = 'movie';

    fixture.detectChanges();

    const titleEl = hostElement.query(By.css('.card__title'));

    expect(titleEl.nativeElement.textContent).toBe('title...');
  });

  it('should set title if textCut input is not provided ', () => {
    const title = 'title example';

    hostComponent.title = title;
    hostComponent.mediaType = 'movie';

    fixture.detectChanges();

    const titleEl = hostElement.query(By.css('.card__title'));

    expect(titleEl.nativeElement.textContent).toBe(title);
  });
});
