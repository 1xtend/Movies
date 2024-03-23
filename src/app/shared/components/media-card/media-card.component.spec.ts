import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaCardComponent } from './media-card.component';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { TextCutPipe } from '@app/shared/pipes/text-cut.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getElementById } from 'src/testing';
import { RouterLink } from '@angular/router';

describe('MediaCardComponent', () => {
  let fixture: ComponentFixture<MediaCardComponent>;
  let component: MediaCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaCardComponent, TextCutPipe],
      imports: [MatCardModule, RouterTestingModule, MatTooltipModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render person-card if mediaType is person', () => {
    component.mediaType = 'person';
    fixture.detectChanges();

    const cardEl = getElementById(fixture, 'person-card');

    expect(cardEl).toBeTruthy();
  });

  it('should render show-card if mediaType is not person', () => {
    component.mediaType = 'movie';
    fixture.detectChanges();

    const cardEl = getElementById(fixture, 'show-card');

    expect(cardEl).toBeTruthy();
    expect(component.mediaType).not.toBe('person');
  });

  it('should render routerLinks correctly', () => {
    component.id = 123;
    component.mediaType = 'movie';
    component.title = 'title';
    fixture.detectChanges();

    const linkEls = fixture.debugElement.queryAll(By.directive(RouterLink));

    expect(linkEls[0].attributes['href']).toBe('/details/movie/123');
    expect(linkEls[1].attributes['href']).toBe('/details/movie/123');
  });

  it('should render routerLinks with language if provided', () => {
    component.id = 123;
    component.mediaType = 'movie';
    component.title = 'title';
    component.language = 'eng';
    fixture.detectChanges();

    const linkEls = fixture.debugElement.queryAll(By.directive(RouterLink));

    expect(linkEls[0].attributes['href']).toBe(
      '/details/movie/123?language=eng'
    );
    expect(linkEls[1].attributes['href']).toBe(
      '/details/movie/123?language=eng'
    );
  });

  it('should cut title if textCut input is provided', () => {
    component.title = 'title example';
    component.textCut = 5;
    component.mediaType = 'movie';

    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'title');

    expect(titleEl.nativeElement.textContent.trim()).toBe('title...');
  });

  it('should set title if textCut input is not provided ', () => {
    const title = 'title example';

    component.title = title;
    component.mediaType = 'person';

    fixture.detectChanges();

    const titleEl = getElementById(fixture, 'title');

    expect(titleEl.nativeElement.textContent.trim()).toBe(title);
  });
});
