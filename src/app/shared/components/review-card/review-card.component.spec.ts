import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewCardComponent } from './review-card.component';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { mockImgData } from 'src/testing';

@Component({
  selector: 'app-avatar',
})
class AvatarMockComponent {
  @Input() imagePath?: string = '';
  @Input() alt: string = '';
}

@Component({
  selector: 'app-truncate-text',
})
class TruncateTextMockComponent {
  @Input() text: string = '';
}

describe('ReviewCardComponent', () => {
  let fixture: ComponentFixture<ReviewCardComponent>;
  let component: ReviewCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ReviewCardComponent,
        AvatarMockComponent,
        TruncateTextMockComponent,
      ],
      imports: [MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewCardComponent);
    component = fixture.componentInstance;

    component.review = {
      author: 'Bob',
      author_details: {
        avatar_path: mockImgData.src,
        name: 'Bob',
        rating: 10,
        username: 'super_bob',
      },
      content: 'long text',
      created_at: '01.01.2001',
      id: '123',
      updated_at: '02.02.1992',
      url: mockImgData.src,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render avatar component', () => {
    fixture.detectChanges();

    const avatarEl = fixture.debugElement.query(
      By.directive(AvatarMockComponent)
    );

    expect(avatarEl).toBeTruthy();
  });

  it('should render truncate-text component', () => {
    fixture.detectChanges();

    const textEl = fixture.debugElement.query(
      By.directive(TruncateTextMockComponent)
    );

    expect(textEl).toBeTruthy();
  });
});
