import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageEnlargerComponent } from './image-enlarger.component';
import { DebugElement } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { getElementById, mockImgData } from 'src/testing';

describe('ImageEnlargerComponent', () => {
  let fixture: ComponentFixture<ImageEnlargerComponent>;
  let component: ImageEnlargerComponent;

  let imgEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageEnlargerComponent],
      imports: [MatDialogModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageEnlargerComponent);
    component = fixture.componentInstance;

    component.imgSrc = mockImgData.src;
    component.alt = mockImgData.alt;

    fixture.detectChanges();

    imgEl = getElementById(fixture, 'img');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correctly img element', () => {
    expect(imgEl).toBeTruthy();
    expect(imgEl.attributes['src']).toBe(mockImgData.src);
    expect(imgEl.attributes['alt']).toBe(mockImgData.alt);
  });

  it('should call openModal by click on img element', () => {
    const openModalSpy = spyOn(component, 'openModal');
    imgEl.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(openModalSpy).toHaveBeenCalled();
  });
});
