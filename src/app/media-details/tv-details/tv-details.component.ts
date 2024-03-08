import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IReviewsResponse } from '@app/shared/models/review.interface';
import { IDetailsTV } from '@app/shared/models/tv/tv.interface';
import { MediaService } from '@app/shared/services/media.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tv-details',
  templateUrl: './tv-details.component.html',
  styleUrls: ['./tv-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TvDetailsComponent {
  @Input() tv!: IDetailsTV;
  @Input() posterPath!: string;
  @Input() original!: string;
  @Input() language?: string;
  @Input() slides$?: Observable<number>;

  opened: boolean = false;
}
