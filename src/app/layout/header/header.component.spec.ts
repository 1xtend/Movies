import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLink } from '@angular/router';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct routerLinks', () => {
    component.isTablet = false;
    fixture.detectChanges();

    const linkEls = fixture.debugElement.queryAll(By.directive(RouterLink));

    expect(linkEls[0].attributes['routerLink']).toBe('/');
    expect(linkEls[1].attributes['routerLink']).toBe('/discover/movie');
    expect(linkEls[2].attributes['routerLink']).toBe('/discover/tv');
  });

  it('should open search toolbar on search button click', () => {
    fixture.detectChanges();

    expect(component.show).toBeFalse();

    const buttonEl = fixture.debugElement.query(
      By.css('[data-testid="search-button"]')
    );
    expect(buttonEl).toBeTruthy();

    buttonEl.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.show).toBeTrue();

    const searchEl = fixture.debugElement.query(
      By.css('[data-testid="search"]')
    );
    expect(searchEl).toBeTruthy();
  });

  it('should emit toggleDrawer on menu button click', () => {
    const emitSpy = spyOn(component.toggleDrawer, 'emit');

    component.isTablet = true;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(
      By.css('[data-testid="menu-button"]')
    );
    expect(buttonEl).toBeTruthy();

    buttonEl.triggerEventHandler('click', null);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should hide nav links and show menu button if isTablet is true', () => {
    component.isTablet = true;
    fixture.detectChanges();

    const linkEls = fixture.debugElement.queryAll(
      By.css('[data-testid="nav-link"]')
    );
    expect(linkEls[0]).toBeUndefined();
    expect(linkEls[1]).toBeUndefined();

    const buttonEl = fixture.debugElement.query(
      By.css('[data-testid="menu-button"]')
    );
    expect(buttonEl).toBeTruthy();
  });
});
