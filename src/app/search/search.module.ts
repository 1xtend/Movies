import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, SearchRoutingModule, MaterialModule, SharedModule],
  providers: [
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
  ],
})
export class SearchModule {}
