import { Component, NgZone, OnInit, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take, tap, catchError, of } from 'rxjs';
import { LoginRequest } from '../../../core/interfaces/auth.interface';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  hide = true;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);
  private _ngZone = inject(NgZone);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log('wtf');
      // @ts-ignore
      google.accounts.id.initialize({
        client_id:
          '83245137874-8v479p9mvj7ccoq71tsditci8r3lgugo.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large' }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async handleCredentialResponse(response: CredentialResponse) {
    console.log('Received credential response:', response);

    await this.authService.loginWithGoogle(response.credential).subscribe(
      (x: any) => {
        console.log('Google login response:', x);
        localStorage.setItem('AUTH_TOKEN', x.token);
        this._ngZone.run(() => {
          this.router.navigateByUrl('/movies');
        });
      },
      (error: any) => {
        console.error('Google login error:', error);
      }
    );
  }

  submitForm(): void {
    const user = this.loginForm.value as LoginRequest;
    console.log(user);

    this.authService
      .login(user)
      .pipe(
        take(1),
        tap((response) => {
          this.authService.token = response?.token;
          this.router.navigateByUrl('/movies');
        }),
        catchError(() => {
          this.loginForm.reset();
          return of(false);
        })
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }
}
