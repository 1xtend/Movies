import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IDetailsTV } from '@app/shared/models/tv/tv.interface';

@Component({
  selector: 'app-tv-details',
  templateUrl: './tv-details.component.html',
  styleUrls: ['./tv-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TvDetailsComponent {
  @Input() tv!: IDetailsTV;
  @Input() posterPath!: string;
}
