import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly KeyStorage = 'THEME';

  private theme$ = new BehaviorSubject<string>(
    (window.localStorage.getItem(this.KeyStorage)) || 'light'
  );

  get theme(): Observable<string> {
    return this.theme$.asObservable();
  }

  set theme(theme: string) {
    window.localStorage.setItem(this.KeyStorage, theme);
    this.theme$.next(theme);
  }
}
