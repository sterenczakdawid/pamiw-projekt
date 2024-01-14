import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  authService = inject(AuthService);

  decoded = this.authService.decodeToken();
  role = this.decoded?.roles[0].authority;
  username = this.decoded?.sub;

  theme$!: Observable<string>;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.theme$ = this.themeService.theme;
  }
}
