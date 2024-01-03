import { Routes } from '@angular/router';
import { DirectorsComponent } from './pages/directors/directors.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { PathRoutes } from './core/constants/routes.const';

export const routes: Routes = [
  {
    path: '',
    redirectTo: PathRoutes.MOVIES,
    pathMatch: 'full',
  },
  {
    path: PathRoutes.MOVIES,
    component: MoviesComponent,
  },
  {
    path: PathRoutes.DIRECTORS,
    component: DirectorsComponent,
  },
  {
    path: PathRoutes.AUTH,
    loadChildren: () => import('./pages/auth/auth.routing'),
  },
  {
    path: '**',
    redirectTo: PathRoutes.MOVIES,
  },
];
