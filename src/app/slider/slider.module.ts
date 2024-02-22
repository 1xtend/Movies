import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideComponent } from './slide/slide.component';
import { SliderComponent } from './slider.component';

@NgModule({
  declarations: [SliderComponent, SlideComponent],
  imports: [CommonModule],
  exports: [SliderComponent, SlideComponent],
})
export class SliderModule {}
