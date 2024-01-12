import { UserToken } from './../interfaces/auth.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private KeyStorage = 'AUTH_TOKEN';
  isGoogle = false;

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

  loginWithGoogle(credentials: string): Observable<AuthResponse> {
    this.isGoogle = true;
    console.log('wysylam ' + credentials);
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http
      .post<ServiceResponse<AuthResponse>>(
        `${environment.apiUrl}${ENDPOINTS.GOOGLE}`,
        JSON.stringify(credentials),
        { headers: header }
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

  decodeToken(): UserToken | null {
    const token = this.token;
    return token ? jwtDecode(token) : null;
  }
}
