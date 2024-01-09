import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, NgForm, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Movie, Director } from '../../core/interfaces/movie.interface';
import { Page } from '../../core/interfaces/page.interface';
import { DirectorService } from '../../core/services/director.service';
import { MovieService } from '../../core/services/movie.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    TranslocoModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit {
  public editMovie!: Movie;
  public deleteMovie!: Movie;

  constructor(
    private movieService: MovieService,
    private directorService: DirectorService
  ) {}

  movies$!: Observable<Page<Movie>>;
  directors$!: Observable<Director[]>;

  ngOnInit(): void {
    setTimeout(() => {
      this.movies$ = this.movieService
        .get()
        .pipe(map((response) => response.data));
    }, 1500);

    this.directors$ = this.directorService
      .getDirectors()
      .pipe(map((response) => response.data));
  }

  public goToPage(title?: string, pageNumber = 0): void {
    this.movies$ = this.movieService
      .get(title, pageNumber)
      .pipe(map((response) => response.data));
  }

  public onOpenModal(movie: Movie, mode: string): void {
    if (mode === 'edit') {
      this.editMovie = movie;
    }
    if (mode === 'delete') {
      this.deleteMovie = movie;
    }
  }

  public onAddMovie(addForm: NgForm): void {
    document.getElementById('add-movie-form')?.click();
    this.movieService.addMovie(addForm.value).subscribe({
      next: (response: Movie) => {
        console.log(response);
        this.goToPage();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      },
    });
  }

  public onUpdateMovie(movie: Movie): void {
    this.movieService.updateMovie(movie).subscribe({
      next: (response: Movie) => {
        console.log(response);
        this.goToPage();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onDeleteMovie(movie: Movie): void {
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => {
        this.goToPage();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }
}
