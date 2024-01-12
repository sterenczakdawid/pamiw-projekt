import { AuthService } from './../../../core/services/auth.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  authService = inject(AuthService);

  decoded = this.authService.decodeToken();
  role = this.decoded?.roles[0].authority;
  username = this.decoded?.sub;
}
