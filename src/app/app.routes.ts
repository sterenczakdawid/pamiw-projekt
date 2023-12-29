import { Routes } from '@angular/router';
import { DirectorsComponent } from './pages/directors/directors.component';
import { MoviesComponent } from './pages/movies/movies.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
  {
    path: 'movies',
    component: MoviesComponent,
  },
  {
    path: 'directors',
    component: DirectorsComponent,
  },
  {
    path: '**',
    redirectTo: 'movies',
  },
];
