import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Movie, Director } from '../../core/interfaces/movie.interface';
import { Page } from '../../core/interfaces/page.interface';
import { DirectorService } from '../../core/services/director.service';
import { MovieService } from '../../core/services/movie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
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
    this.movies$ = this.movieService
      .get()
      .pipe(map((response) => response.data));

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
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addMovieModal');
    }
    if (mode === 'edit') {
      this.editMovie = movie;
      button.setAttribute('data-target', '#updateMovieModal');
    }
    if (mode === 'delete') {
      this.deleteMovie = movie;
      button.setAttribute('data-target', '#deleteMovieModal');
    }
    container?.appendChild(button);
    button.click();
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

  public onDeleteMovie(movieId: number): void {
    this.movieService.deleteMovie(movieId).subscribe({
      next: () => {
        console.log('Movie deleted successfully');
        this.goToPage();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }
}
