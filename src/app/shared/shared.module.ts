import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ShowCardComponent } from './components/show-card/show-card.component';
import { RouterModule } from '@angular/router';
import { ShowDialogComponent } from './components/show-dialog/show-dialog.component';

@NgModule({
  declarations: [
    SearchFieldComponent,
    LoaderComponent,
    ShowCardComponent,
    ShowDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    SearchFieldComponent,
    LoaderComponent,
    ShowCardComponent,
    ShowDialogComponent,
  ],
})
export class SharedModule {}
