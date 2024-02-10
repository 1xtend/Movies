import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { IGenre } from '@app/shared/models/genre.interface';
import { MediaType } from '@app/shared/models/media.type';
import {
  IDetailsMovie,
  ISearchMovie,
} from '@app/shared/models/movie/movie.interface';
import {
  IDetailsPerson,
  ISearchPerson,
} from '@app/shared/models/person/person.interface';
import { IDetailsTV, ISearchTV } from '@app/shared/models/tv/tv.interface';
import { MediaService } from '@app/shared/services/media.service';
import { EMPTY, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environment/environment';

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
    Partial<{ movie: IDetailsMovie; tv: IDetailsTV; person: IDetailsPerson }>
  >();
  res$ = this.resSubject.asObservable();

  private mediaType: MediaType = this.route.snapshot.data['mediaType'];
  private id: number = Number(this.route.snapshot.params['id']);

  posterPath = environment.imagePaths.original;
  backdropPath = environment.imagePaths.w1280Backdrop;

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchMedia().subscribe((res) => {
      console.log('Response: ', res);
    });
  }

  private fetchMedia(): Observable<
    IDetailsMovie | IDetailsPerson | IDetailsTV
  > {
    if (this.mediaType === 'movie') {
      return this.mediaService.getMovieDetails(this.id).pipe(
        tap((res) => {
          this.resSubject.next({ movie: res });
        })
      );
    }

    if (this.mediaType === 'tv') {
      return this.mediaService.getTVDetails(this.id).pipe(
        tap((res) => {
          this.resSubject.next({ tv: res });
        })
      );
    }

    if (this.mediaType === 'person') {
      return this.mediaService.getPersonDetails(this.id).pipe(
        tap((res) => {
          this.resSubject.next({ person: res });
        })
      );
    }

    return EMPTY;
  }

  trackByGenre(index: number, genre: IGenre): number {
    return genre.id;
  }
}
