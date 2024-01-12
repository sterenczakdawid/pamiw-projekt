import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { PathRoutes } from '../../core/constants/routes.const';
import { authGuard } from '../../core/guards/auth.guard';

export default [
  {
    path: '',
    redirectTo: PathRoutes.LOGIN,
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: PathRoutes.LOGIN,
        loadComponent: () =>
          import('../auth/login/login.component').then(
            (mod) => mod.LoginComponent
          ),
      },
      {
        path: PathRoutes.REGISTER,
        loadComponent: () =>
          import('../auth/register/register.component').then(
            (mod) => mod.RegisterComponent
          ),
      },
      {
        path: PathRoutes.ACCOUNT,
        loadComponent: () =>
          import('../auth/account/account.component').then(
            (mod) => mod.AccountComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
] as Routes;
