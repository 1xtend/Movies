import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { MediaCardComponent } from './components/media-card/media-card.component';
import { RoundPipe } from './pipes/round.pipe';
import { TimePipe } from './pipes/time.pipe';
import { TextCutPipe } from './pipes/text-cut.pipe';

@NgModule({
  declarations: [
    SearchFieldComponent,
    LoaderComponent,
    MediaCardComponent,
    RoundPipe,
    TimePipe,
    TextCutPipe,
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
    MediaCardComponent,
    RoundPipe,
    TimePipe,
    TextCutPipe,
  ],
})
export class SharedModule {}
