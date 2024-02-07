import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { MediaService } from '@app/shared/services/media.service';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.scss'],
})
export class MediaDetailsComponent
  extends UnsubscribeAbstract
  implements OnInit
{
  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService
  ) {
    super();
  }

  ngOnInit(): void {}
}
