import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFieldComponent } from './components/search-field/search-field.component';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [SearchFieldComponent],
})
export class SharedModule {}
