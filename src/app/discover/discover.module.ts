import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscoverRoutingModule } from './discover-routing.module';
import { DiscoverComponent } from './discover.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [DiscoverComponent],
  imports: [CommonModule, DiscoverRoutingModule, SharedModule, MaterialModule],
})
export class DiscoverModule {}
