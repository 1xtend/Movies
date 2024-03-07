import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly github = environment.github;
  readonly tmdb = environment.tmdb;
}
