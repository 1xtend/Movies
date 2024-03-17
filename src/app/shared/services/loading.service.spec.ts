import { TestBed, fakeAsync } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { first } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });

    service = TestBed.inject(LoadingService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should init loading$ with correct value', fakeAsync(() => {
    service.loading$.pipe(first()).subscribe((value) => {
      expect(value).toBeFalse();
    });
  }));

  it('should set loadingSubject by calling setLoading', fakeAsync(() => {
    service.setLoading(true);

    service.loading$.pipe(first()).subscribe((value) => {
      expect(value).toBeTrue();
    });
  }));
});
