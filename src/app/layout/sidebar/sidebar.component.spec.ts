import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  let linkEls: DebugElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    linkEls = fixture.debugElement.queryAll(By.directive(RouterLink));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct routerLinks', () => {
    expect(linkEls[0].attributes['routerLink']).toBe('/discover/movie');
    expect(linkEls[1].attributes['routerLink']).toBe('/discover/tv');
  });

  it('should emit closeDrawer on link click', () => {
    const emitSpy = spyOn(component.closeDrawer, 'emit');

    linkEls[0].nativeElement.click();
    expect(emitSpy).toHaveBeenCalled();

    linkEls[1].nativeElement.click();
    expect(emitSpy).toHaveBeenCalled();
  });
});
