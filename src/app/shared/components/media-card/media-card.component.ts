import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MediaType } from '@app/shared/models/media.type';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCardComponent {
  @Input() mediaType!: MediaType;
  @Input() imagePath: string | null = '';
  @Input() voteAverage? = 0;
  @Input() releaseDate? = '';
  @Input() title = '';
  @Input() id = 0;
  @Input() titleSize?: number;
  @Input() textCut?: number;
  @Input() language?: string;

  readonly imgUrl =
    this.mediaType === 'person'
      ? environment.imagePaths.h632Profile
      : environment.imagePaths.w500Poster;
}
