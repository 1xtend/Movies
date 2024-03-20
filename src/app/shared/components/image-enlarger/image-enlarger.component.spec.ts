import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageEnlargerComponent } from './image-enlarger.component';
import { DebugElement } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { mockImgData } from 'src/testing';

describe('ImageEnlargerComponent', () => {
  let fixture: ComponentFixture<ImageEnlargerComponent>;
  let component: ImageEnlargerComponent;
  let element: DebugElement;

  let imgEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageEnlargerComponent],
      imports: [MatDialogModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageEnlargerComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    component.imgSrc = mockImgData.src;
    component.alt = mockImgData.alt;

    fixture.detectChanges();

    imgEl = element.query(By.css('[data-testid="img"]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render img element', () => {
    expect(imgEl).toBeTruthy();
  });

  it('should render img element with provided input properties', () => {
    expect(imgEl.nativeElement.src).toBe(mockImgData.src);
    expect(imgEl.nativeElement.alt).toBe(mockImgData.alt);
  });

  it('should call openModal by click on img element', () => {
    const openModalSpy = spyOn(component, 'openModal').and.callThrough();
    imgEl.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(openModalSpy).toHaveBeenCalled();
  });
});
