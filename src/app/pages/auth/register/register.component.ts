import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { take, tap, catchError, of, Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PasswordMatchValidator } from '../../../shared/validators/password-match.validator';
import { TranslocoModule } from '@ngneat/transloco';
import { RegisterRequest } from '../../../core/interfaces/auth.interface';
import { ThemeService } from '../../../core/services/theme.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  theme$!: Observable<string>;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.theme$ = this.themeService.theme;
  }

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
    },
    { validators: [PasswordMatchValidator] }
  );

  submitForm(): void {
    const user = this.registerForm.value as RegisterRequest;
    console.log(user);

    this.authService
      .register(user)
      .pipe(
        take(1),
        tap((response) => {
          this.authService.token = response?.token;
          this.router.navigateByUrl('/movies');
        }),
        catchError(() => {
          this.registerForm.reset();
          return of(false);
        })
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
