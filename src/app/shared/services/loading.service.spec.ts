import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { first } from 'rxjs';

fdescribe('LoadingService', () => {
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

  it('setLoading should set loading$ to provided value', fakeAsync(() => {
    service.setLoading(true);

    service.loading$.pipe(first()).subscribe((value) => {
      expect(value).toBeTrue();
    });
    tick();
  }));
});
