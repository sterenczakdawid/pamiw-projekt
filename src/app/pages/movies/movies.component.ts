import { ThemeService } from './../../core/services/theme.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit {
  movies$!: Observable<Page<Movie>>;
  directors$!: Observable<Director[]>;
  public editMovie!: Movie;
  public deleteMovie!: Movie;
  public currentPage = 0;

  constructor(
    private movieService: MovieService,
    private directorService: DirectorService
  ) {}

  theme$!: Observable<string>;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.theme$ = this.themeService.theme;
    setTimeout(() => {
      this.movies$ = this.movieService
        .get()
        .pipe(map((response) => response.data));
    }, 500);

    this.directors$ = this.directorService
      .getDirectors()
      .pipe(map((response) => response.data));
  }

  public goToPage(title?: string, pageNumber = 0): void {
    this.movies$ = this.movieService
      .get(title, pageNumber)
      .pipe(map((response) => response.data));

    this.currentPage = pageNumber;
  }

  public goToNextOrPreviousPage(direction?: string, title?: string): void {
    this.goToPage(
      title,
      direction === 'next' ? this.currentPage + 1 : this.currentPage - 1
    );
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
    // console.log(addForm.value);
    this.movieService.addMovie(addForm.value).subscribe({
      next: (response: Movie) => {
        // console.log(response);
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
        console.log(error);
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
