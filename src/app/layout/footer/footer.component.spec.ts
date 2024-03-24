import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [MatToolbarModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct links', () => {
    const linkEls = fixture.debugElement.queryAll(
      By.css('[data-testid="link"]')
    );

    expect(linkEls[0].attributes['href']).toBe(
      'https://github.com/1xtend/Movies'
    );
    expect(linkEls[1].attributes['href']).toBe(
      'https://developer.themoviedb.org/docs/getting-started'
    );
  });
});
