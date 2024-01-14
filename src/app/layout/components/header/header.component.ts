import { CommonModule } from '@angular/common';
import { AuthService } from './../../../core/services/auth.service';
import { Component, NgZone, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { PathRoutes } from '../../../core/constants/routes.const';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
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

  theme$!: Observable<string>;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.theme$ = this.themeService.theme;
  }

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

  changeTheme(newTheme: string, oldTheme: string): void {
    if (newTheme == oldTheme) return;
    this.themeService.theme = newTheme;
  }

  toggle() {
    let buttons = document.getElementById('buttons');
    buttons?.classList.toggle('hidden');
  }

  isMobileMenuOpen = false;

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
