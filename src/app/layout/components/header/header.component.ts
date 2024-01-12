import { AuthService } from './../../../core/services/auth.service';
import { Component, NgZone, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { PathRoutes } from '../../../core/constants/routes.const';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    TranslocoModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  translocoService = inject(TranslocoService);
  authService = inject(AuthService);
  router = inject(Router);
  private _ngZone = inject(NgZone);

  logout() {
    this.authService.removeToken();
    this._ngZone.run(() => {
      this.router
        .navigateByUrl('/auth/login')
        .then(() => window.location.reload());
    });
  }

  changeLanguage() {
    this.translocoService.getActiveLang();
    if (this.translocoService.getActiveLang() == 'pl') {
      this.translocoService.setActiveLang('en');
    } else {
      this.translocoService.setActiveLang('pl');
    }
  }
}
