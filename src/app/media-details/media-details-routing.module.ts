import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaDetailsComponent } from './media-details.component';

const routes: Routes = [
  {
    path: 'tv/:id',
    component: MediaDetailsComponent,
    data: {
      type: 'tv',
    },
  },
  {
    path: 'movie/:id',
    component: MediaDetailsComponent,
    data: {
      type: 'movie',
    },
  },
  {
    path: 'person/:id',
    component: MediaDetailsComponent,
    data: {
      type: 'person',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaDetailsRoutingModule {}
