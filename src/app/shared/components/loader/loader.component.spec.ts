import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '@app/shared/services/loading.service';
import { of } from 'rxjs';
import { getElementById } from 'src/testing';

describe('LoaderComponent', () => {
  let fixture: ComponentFixture<LoaderComponent>;
  let component: LoaderComponent;

  const mockLoadingService = {
    loading$: of(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [MatProgressBarModule],
      providers: [
        {
          provide: LoadingService,
          useValue: mockLoadingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render loader if loading$ is true', () => {
    mockLoadingService.loading$ = of(true);
    fixture.detectChanges();

    const loaderEl = getElementById(fixture, 'loader');

    expect(loaderEl).toBeTruthy();
  });

  it('should not render loader if loading$ is false', () => {
    mockLoadingService.loading$ = of(false);
    fixture.detectChanges();

    const loaderEl = getElementById(fixture, 'loader');

    expect(loaderEl).toBeNull();
  });
});
