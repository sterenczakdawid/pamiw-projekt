import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatButtonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  authService = inject(AuthService);

  decoded = this.authService.decodeToken();
  role = this.decoded?.roles[0].authority;
  username = this.decoded?.sub;

  image = '';

  theme$!: Observable<string>;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.theme$ = this.themeService.theme;
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64,
    });

    if (image) {
      this.image = `data:image/jpeg;base64, ${image.base64String}`!;
    }
  }
}
