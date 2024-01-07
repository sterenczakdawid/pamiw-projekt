import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Movie, Director } from '../../core/interfaces/movie.interface';
import { Page } from '../../core/interfaces/page.interface';
import { DirectorService } from '../../core/services/director.service';
import { MovieService } from '../../core/services/movie.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, TranslocoModule],
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
    if (mode === 'edit') {
      this.editMovie = movie;
    }
    if (mode === 'delete') {
      console.log('delete', movie.title);
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

  // public onUpdateMovie(movie: Movie): void {
  //   this.movieService.updateMovie(movie).subscribe({
  //     next: (response: Movie) => {
  //       console.log(response);
  //       this.goToPage();
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     },
  //   });
  // }

  public onDeleteMovie(movie: Movie): void {
    this.movieService.deleteMovie(movie.id).subscribe({
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
