import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Director } from '../../core/interfaces/movie.interface';
import { Page } from '../../core/interfaces/page.interface';
import { DirectorService } from '../../core/services/director.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-directors',
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
  templateUrl: './directors.component.html',
  styleUrl: './directors.component.scss',
})
export class DirectorsComponent implements OnInit {
  directors$!: Observable<Director[]>;
  directorsPage$!: Observable<Page<Director>>;
  public editDirector!: Director;
  public deleteDirector!: Director;
  public currentPage = 0;

  constructor(private directorService: DirectorService) {}

  theme$!: Observable<string>;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.theme$ = this.themeService.theme;
    this.directorsPage$ = this.directorService
      .getPage('', 0)
      .pipe(map((response) => response.data));
  }

  public goToPage(name?: string, pageNumber = 0): void {
    this.directorsPage$ = this.directorService
      .getPage(name, pageNumber)
      .pipe(map((response) => response.data));

    this.currentPage = pageNumber;
  }

  public goToNextOrPreviousPage(direction?: string, title?: string): void {
    this.goToPage(
      title,
      direction === 'next' ? this.currentPage + 1 : this.currentPage - 1
    );
  }

  public onOpenModal(director: Director, mode: string): void {
    if (mode === 'edit') {
      this.editDirector = director;
    }
    if (mode === 'delete') {
      this.deleteDirector = director;
    }
  }

  public onAddDirector(addForm: NgForm): void {
    this.directorService.addDirector(addForm.value).subscribe({
      next: (response: Director) => {
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
        this.goToPage();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      },
    });
  }

  public onDeleteDirector(director: Director): void {
    this.directorService.deleteDirector(director.id).subscribe({
      next: () => {
        this.goToPage();
      },
      error: (error: HttpErrorResponse) => {
        alert('Cannot remove director, delete his/her movies first!');
      },
    });
  }
}
