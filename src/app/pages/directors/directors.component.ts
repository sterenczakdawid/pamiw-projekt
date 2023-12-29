import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Director } from '../../core/interfaces/movie.interface';
import { Page } from '../../core/interfaces/page.interface';
import { DirectorService } from '../../core/services/director.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-directors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './directors.component.html',
  styleUrl: './directors.component.scss'
})
export class DirectorsComponent implements OnInit {
  directors$!: Observable<Director[]>;
  directorsPage$!: Observable<Page<Director>>;
  public editDirector?: Director;
  public deleteDirector?: Director;

  constructor(private directorService: DirectorService) {}

  ngOnInit(): void {
    this.directors$ = this.directorService
      .getDirectors()
      .pipe(map((response) => response.data));

    this.directorsPage$ = this.directorService
      .getPage('', 0)
      .pipe(map((response) => response.data));
  }

  public goToPage(name?: string, pageNumber = 0): void {
    this.directorsPage$ = this.directorService
      .getPage(name, pageNumber)
      .pipe(map((response) => response.data));
  }

  public onOpenModal(director: Director, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addDirectorModal');
    }
    if (mode === 'edit') {
      this.editDirector = director;
      button.setAttribute('data-target', '#updateDirectorModal');
    }
    if (mode === 'delete') {
      this.deleteDirector = director;
      button.setAttribute('data-target', '#deleteDirectorModal');
    }
    container!.appendChild(button);
    button.click();
  }

  public onAddDirector(addForm: NgForm): void {
    document.getElementById('add-director-form')?.click();
    this.directorService.addDirector(addForm.value).subscribe({
      next: (response: Director) => {
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

  public onUpdateDirector(director: Director): void {
    this.directorService.updateDirector(director).subscribe({
      next: (response: Director) => {
        console.log(response);
        this.goToPage();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onDeleteDirector(directorId: number): void {
    this.directorService.deleteDirector(directorId).subscribe({
      next: () => {
        console.log('Director deleted successfully');
        this.goToPage();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }
}