import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverComponent } from './discover.component';

const routes: Routes = [
  {
    path: 'tv',
    component: DiscoverComponent,
    data: {
      type: 'tv',
    },
  },
  {
    path: '',
    redirectTo: 'tv',
    pathMatch: 'full',
  },
  {
    path: 'movie',
    component: DiscoverComponent,
    data: {
      type: 'movie',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoverRoutingModule {}
