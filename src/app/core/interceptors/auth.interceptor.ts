import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';


export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authToken = inject(AuthService).token;
  if (req.url.startsWith(environment.apiUrl) && authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  return next(req);
};
