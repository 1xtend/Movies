import { ImageModalComponent } from './image-modal.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { getElementById, mockImgData } from 'src/testing';

describe('ImageModalComponent', () => {
  let fixture: ComponentFixture<ImageModalComponent>;
  let component: ImageModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageModalComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            src: mockImgData.src,
            alt: mockImgData.alt,
          },
        },
      ],
      imports: [MatDialogModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correctly dialog', () => {
    const imgEl = getElementById(fixture, 'img');

    expect(imgEl).toBeTruthy();
    expect(imgEl.attributes['src']).toBe(mockImgData.src);
    expect(imgEl.attributes['alt']).toBe(mockImgData.alt);
  });
});
