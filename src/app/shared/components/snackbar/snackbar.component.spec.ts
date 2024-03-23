import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from './snackbar.component';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { NotificationService } from '@app/shared/services/notification.service';
import { getElementById } from 'src/testing';

describe('SnackbarComponent', () => {
  let fixture: ComponentFixture<SnackbarComponent>;
  let component: SnackbarComponent;

  const mockSnackbarRef = jasmine.createSpyObj('snackbar', [
    'dismissWithAction',
  ]);
  const mockNotificationService = {
    message$: of('error message'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackbarComponent],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: mockSnackbarRef,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
      imports: [MatSnackBarModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message', () => {
    const messageEl = getElementById(fixture, 'message');

    expect(messageEl.nativeElement.textContent.trim()).toBe('error message');
  });

  it('should close snackbar on close button click', () => {
    const buttonEl = getElementById(fixture, 'close-button');
    buttonEl.triggerEventHandler('click', null);

    expect(mockSnackbarRef.dismissWithAction).toHaveBeenCalled();
  });
});
