import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ImageEnlargerComponent } from './image-enlarger.component';
import { DebugElement } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

const testPath = 'https://picsum.photos/200';
const testAlt = 'test alt';

fdescribe('ImageEnlargerComponent', () => {
  let fixture: ComponentFixture<ImageEnlargerComponent>;
  let component: ImageEnlargerComponent;
  let element: DebugElement;

  let imgEl: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageEnlargerComponent],
      imports: [MatDialogModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEnlargerComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    component.imgSrc = testPath;
    component.alt = testAlt;

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
    expect(imgEl.nativeElement.src).toBe(testPath);
    expect(imgEl.nativeElement.alt).toBe(testAlt);
  });

  it('should call openModal by click on img element', () => {
    const openModalSpy = spyOn(component, 'openModal').and.callThrough();
    imgEl.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(openModalSpy).toHaveBeenCalled();
  });
});
