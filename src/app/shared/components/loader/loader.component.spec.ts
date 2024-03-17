import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { DebugElement } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '@app/shared/services/loading.service';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let fixture: ComponentFixture<LoaderComponent>;
  let component: LoaderComponent;
  let element: DebugElement;

  let service: LoadingService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [MatProgressBarModule],
      providers: [LoadingService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    service = TestBed.inject(LoadingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mat-progress-bar if loading$ is true', fakeAsync(() => {
    service.setLoading(true);

    fixture.detectChanges();
    const progressBar = element.query(By.css('[data-testid="loader"]'));

    expect(progressBar).toBeTruthy();
  }));

  it('should not render mat-progress-bar if loading$ is false', fakeAsync(() => {
    service.setLoading(false);

    fixture.detectChanges();
    const progressBar = element.query(By.css('[data-testid="loader"]'));

    expect(progressBar).toBeFalsy();
  }));
});
