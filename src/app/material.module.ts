import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';

const Material = [MatToolbarModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...Material],
  exports: [...Material],
})
export class MaterialModule {}
