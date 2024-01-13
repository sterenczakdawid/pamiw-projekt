import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Director } from '../interfaces/movie.interface';
import { Page } from '../interfaces/page.interface';
import { ENDPOINTS } from '../constants/endpoints.const';
import { ServiceResponse } from '../interfaces/service-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DirectorService {
  private http = inject(HttpClient);

  public getPage(
    name = '',
    page = 0,
    size = 8
  ): Observable<ServiceResponse<Page<Director>>> {
    const params = new HttpParams()
      .append('name', name)
      .append('page', page)
      .append('size', size);

    return this.http.get<ServiceResponse<Page<Director>>>(
      `${environment.apiUrl}${ENDPOINTS.DIRECTORS}`,
      { params }
    );
  }

  public getDirectors(): Observable<ServiceResponse<Director[]>> {
    return this.http.get<ServiceResponse<Director[]>>(
      environment.apiUrl + ENDPOINTS.DIRECTORS_GET
    );
  }

  public addDirector(director: Director): Observable<Director> {
    return this.http.post<Director>(
      environment.apiUrl + ENDPOINTS.DIRECTORS_ADD,
      director
    );
  }

  public updateDirector(director: Director): Observable<Director> {
    return this.http.put<Director>(
      environment.apiUrl + ENDPOINTS.DIRECTORS_UPDATE,
      director
    );
  }

  public deleteDirector(directorId: number): Observable<void> {
    return this.http.delete<void>(
      environment.apiUrl + ENDPOINTS.DIRECTORS_DELETE + directorId
    );
  }
}
