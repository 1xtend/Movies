import { DebugElement } from '@angular/core';
import { ImageModalComponent } from './image-modal.component';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

const testPath = 'https://picsum.photos/200';
const testAlt = 'test alt';

describe('ImageModalComponent', () => {
  let fixture: ComponentFixture<ImageModalComponent>;
  let component: ImageModalComponent;
  let element: DebugElement;

  let imgEl: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageModalComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            src: testPath,
            alt: testAlt,
          },
        },
      ],
      imports: [MatDialogModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageModalComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    fixture.detectChanges();

    imgEl = element.query(By.css('[data-testid="img"]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render img element', () => {
    expect(imgEl).toBeTruthy();
  });

  it('should render img element with injected data properties', () => {
    expect(imgEl.nativeElement.src).toBe(testPath);
    expect(imgEl.nativeElement.alt).toBe(testAlt);
  });
});
