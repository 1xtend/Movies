import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IShow } from '@app/shared/models/show.interface';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowCardComponent {
  @Input() show?: IShow;

  readonly imageUrl = environment.apiImageUrl;
}
