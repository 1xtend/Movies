import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { MediaType } from '@app/shared/models/media.type';
import { ISearchMovie } from '@app/shared/models/movie/movie.interface';
import { ISearchPerson } from '@app/shared/models/person/person.interface';
import { ISearchTV } from '@app/shared/models/tv/tv.interface';
import { MediaService } from '@app/shared/services/media.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.scss'],
})
export class MediaDetailsComponent
  extends UnsubscribeAbstract
  implements OnInit
{
  private resSubject = new Subject<
    Partial<{
      movies: ISearchMovie;
      tvs: ISearchTV;
      people: ISearchPerson;
    }>
  >();
  res$ = this.resSubject.asObservable();

  private mediaType: MediaType = this.route.snapshot.data['mediaType'];

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService
  ) {
    super();
  }

  ngOnInit(): void {}

  private fetchMedia() {}
}
