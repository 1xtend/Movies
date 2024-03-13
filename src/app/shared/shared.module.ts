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
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { TruncateTextComponent } from './components/truncate-text/truncate-text.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { RandomBgColorDirective } from './directives/random-bg-color.directive';
import { ImageEnlargerComponent } from './components/image-enlarger/image-enlarger.component';
import { ImageModalComponent } from './components/image-modal/image-modal.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { LazyImgDirective } from './directives/lazy-img.directive';

@NgModule({
  declarations: [
    SearchFieldComponent,
    LoaderComponent,
    MediaCardComponent,
    RoundPipe,
    TimePipe,
    TextCutPipe,
    ReviewCardComponent,
    TruncateTextComponent,
    AvatarComponent,
    RandomBgColorDirective,
    ImageEnlargerComponent,
    ImageModalComponent,
    SnackbarComponent,
    LazyImgDirective,
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
    ReviewCardComponent,
    TruncateTextComponent,
    AvatarComponent,
    RandomBgColorDirective,
    ImageEnlargerComponent,
    LazyImgDirective,
  ],
})
export class SharedModule {}
