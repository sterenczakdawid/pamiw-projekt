import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { take, tap, catchError, of } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
} from '../../../core/interfaces/auth.interface';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide = true;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  // canSubmit = true;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

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
}
