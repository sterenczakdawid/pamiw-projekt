import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
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
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  translocoService = inject(TranslocoService);

  changeLanguage() {
    this.translocoService.getActiveLang();
    if (this.translocoService.getActiveLang() == 'pl') {
      this.translocoService.setActiveLang('en');
    } else {
      this.translocoService.setActiveLang('pl');
    }
  }
}
