import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { Component } from '@angular/core';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Component({
  selector: 'app-snackbar',
  template: '',
})
class SnackbarMockComponent implements Partial<SnackbarComponent> {}

describe('NotificationService', () => {
  let service: NotificationService;

  const snackBarServiceMock = jasmine.createSpyObj('matSnackBar', [
    'openFromComponent',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        {
          provide: MatSnackBar,
          useValue: snackBarServiceMock,
        },
      ],
    });

    service = TestBed.inject(NotificationService);

    snackBarServiceMock.openFromComponent.and.callFake(() =>
      console.log('mock open func')
    );
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('openSnackbar should set message$ to provided value', fakeAsync(() => {
    service.openSnackbar('text');

    service.message$.pipe(first()).subscribe((value) => {
      expect(value).toBe('text');
    });
    tick();
  }));

  it('openSnackbar should call openFromComponent', () => {
    service.openSnackbar('text');

    expect(snackBarServiceMock.openFromComponent).toHaveBeenCalled();
  });

  it('openSnackbar should call openFromComponent with provided duration', () => {
    service.openSnackbar('text', 3000);

    expect(snackBarServiceMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent as SnackbarMockComponent,
      { duration: 3000 }
    );
  });
});
