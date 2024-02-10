import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IDetailsMovie } from '@app/shared/models/movie/movie.interface';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsComponent {
  @Input() movie!: IDetailsMovie;
  @Input() posterPath!: string;
  @Input() backdropPath!: string;
}
