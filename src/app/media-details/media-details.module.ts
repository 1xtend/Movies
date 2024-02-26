import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaDetailsRoutingModule } from './media-details-routing.module';
import { MediaDetailsComponent } from './media-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { TvDetailsComponent } from './tv-details/tv-details.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { SliderModule } from '@app/slider/slider.module';

@NgModule({
  declarations: [
    MediaDetailsComponent,
    MovieDetailsComponent,
    TvDetailsComponent,
    PersonDetailsComponent,
  ],
  imports: [
    CommonModule,
    MediaDetailsRoutingModule,
    SharedModule,
    MaterialModule,
    SliderModule,
  ],
})
export class MediaDetailsModule {}
