import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

const testAlt = 'test alt';
const testPath = 'https://picsum.photos/200';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;
  let element: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      imports: [MatCardModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    component.alt = testAlt;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image if imagePath input is provided', () => {
    component.imagePath = testPath;

    fixture.detectChanges();

    const imgEl = element.query(By.css('[data-testid="img"]'));

    expect(imgEl.nativeElement.src).toBe(testPath);
  });

  it('should render #noAvatar template if imagePath property is not provided', () => {
    fixture.detectChanges();

    const template = element.query(By.css('.letter'));

    expect(template.nativeElement.textContent).toBe('T');
  });
});
