import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IReview, IReviewsResponse } from '@app/shared/models/review.interface';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent {
  @Input({ required: true }) review!: IReview;

  readonly logoPath = environment.imagePaths.w45Logo;
}
