import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Component } from '@angular/core';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({ selector: 'app-loader', template: '' })
class LoaderStubComponent implements Partial<LoaderComponent> {}

@Component({ selector: 'app-header', template: '' })
class HeaderStubComponent implements Partial<HeaderComponent> {}

@Component({ selector: 'app-footer', template: '' })
class FooterStubComponent implements Partial<FooterComponent> {}

@Component({ selector: 'app-sidebar', template: '' })
class SidebarStubComponent implements Partial<SidebarComponent> {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoaderStubComponent,
        HeaderStubComponent,
        FooterStubComponent,
        SidebarStubComponent,
      ],
      imports: [MatSidenavModule, RouterTestingModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create app', () => {
    expect(component).toBeTruthy();
  });

  it('should create app-loader component', () => {
    const element = fixture.debugElement.query(
      By.directive(LoaderStubComponent)
    );
    expect(element.componentInstance).toBeTruthy();
  });

  it('should create app-header component', () => {
    const element = fixture.debugElement.query(
      By.directive(HeaderStubComponent)
    );
    expect(element.componentInstance).toBeTruthy();
  });

  it('should create app-footer component', () => {
    const element = fixture.debugElement.query(
      By.directive(FooterStubComponent)
    );
    expect(element.componentInstance).toBeTruthy();
  });

  it('should create app-sidebar component', () => {
    const element = fixture.debugElement.query(
      By.directive(SidebarStubComponent)
    );
    expect(element.componentInstance).toBeTruthy();
  });
});
