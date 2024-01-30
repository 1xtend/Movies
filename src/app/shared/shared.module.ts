import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search/search.component';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, MaterialModule],
  exports: [SearchComponent],
})
export class SharedModule {}
