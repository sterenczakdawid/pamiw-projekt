import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ENDPOINTS } from '../constants/endpoints.const';
import {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
} from '../interfaces/auth.interface';
import { ServiceResponse } from '../interfaces/service-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private KeyStorage = 'AUTH_TOKEN';

  register(authRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<ServiceResponse<AuthResponse>>(
        `${environment.apiUrl}${ENDPOINTS.REGISTER}`,
        authRequest
      )
      .pipe(map((res) => res?.data));
  }

  login(authRequest: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<ServiceResponse<AuthResponse>>(
        `${environment.apiUrl}${ENDPOINTS.AUTH}`,
        authRequest
      )
      .pipe(map((res) => res?.data));
  }

  get token(): string | null {
    return window.localStorage.getItem(this.KeyStorage) || null;
  }

  set token(val: string) {
    window.localStorage.setItem(this.KeyStorage, val);
  }

  removeToken(): void {
    window.localStorage.removeItem(this.KeyStorage);
  }
}
