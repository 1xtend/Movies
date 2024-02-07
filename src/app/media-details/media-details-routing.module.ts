import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaDetailsComponent } from './media-details.component';

const routes: Routes = [
  {
    path: 'tv/:id',
    component: MediaDetailsComponent,
    data: {
      mediaType: 'tv',
    },
  },
  {
    path: 'movie/:id',
    component: MediaDetailsComponent,
    data: {
      mediaType: 'movie',
    },
  },
  {
    path: 'person/:id',
    component: MediaDetailsComponent,
    data: {
      mediaType: 'person',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaDetailsRoutingModule {}
