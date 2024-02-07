import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaDetailsRoutingModule } from './media-details-routing.module';
import { MediaDetailsComponent } from './media-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [MediaDetailsComponent],
  imports: [
    CommonModule,
    MediaDetailsRoutingModule,
    SharedModule,
    MaterialModule,
  ],
})
export class MediaDetailsModule {}
