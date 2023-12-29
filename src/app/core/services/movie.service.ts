import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../interfaces/movie.interface';
import { environment } from '../../../environments/environment.development'
import { Page } from '../interfaces/page.interface';
import { ENDPOINTS } from '../constants/Endpoints.const';
import { ServiceResponse } from '../interfaces/service-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);

  public get(title = '', page = 0, size = 5): Observable<ServiceResponse<Page<Movie>>> {
    const params = new HttpParams().append('title', title).append('page', page).append('size', size);
  
    return this.http.get<ServiceResponse<Page<Movie>>>(`${environment.apiUrl}${ENDPOINTS.MOVIES_GET}`, { params });
  }

  public addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(environment.apiUrl + ENDPOINTS.MOVIES_ADD, movie);
  }

  public updateMovie(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(environment.apiUrl + ENDPOINTS.MOVIES_UPDATE, movie);
  }

  public deleteMovie(movieId: number): Observable<void> {
    return this.http.delete<void>(
      environment.apiUrl + ENDPOINTS.MOVIES_DELETE + movieId
    );
  }
}
