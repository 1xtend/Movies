import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: 'tv',
    component: SearchComponent,
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
    component: SearchComponent,
    data: {
      type: 'movie',
    },
  },
  {
    path: 'person',
    component: SearchComponent,
    data: {
      type: 'person',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
