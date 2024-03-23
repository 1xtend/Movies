import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { MatCardModule } from '@angular/material/card';
import { getElementById, mockImgData } from 'src/testing';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      imports: [MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;

    component.alt = mockImgData.alt;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image if imagePath input is provided', () => {
    component.imagePath = mockImgData.src;
    fixture.detectChanges();

    const imgEl = getElementById(fixture, 'img');

    expect(imgEl.attributes['src']).toBe(mockImgData.src);
  });

  it('should render #noAvatar template if imagePath property is not provided', () => {
    fixture.detectChanges();

    const noAvatarEl = getElementById(fixture, 'no-avatar');
    const letterEl = getElementById(noAvatarEl, 'no-avatar-letter');

    expect(noAvatarEl).toBeTruthy();
    expect(letterEl.nativeElement.textContent.trim()).toBe('T');
  });
});
