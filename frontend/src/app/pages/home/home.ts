import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardService, Board } from '../../services/board';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private boardService = inject(BoardService);
  private fb = inject(FormBuilder);

  boards = signal<Board[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  showCreateForm = signal(false);
  isSaving = signal(false);
  editingBoard = signal<Board | null>(null);

  boardForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    color: ['#2563eb', [Validators.required]],
    background_theme: ['Azul', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.boardService.getBoards().subscribe({
      next: (response) => {
        this.boards.set(response.boards);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando tableros', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los tableros');
        this.isLoading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.editingBoard.set(null);

    this.boardForm.reset({
      title: '',
      description: '',
      color: '#2563eb',
      background_theme: 'Azul'
    });

    this.showCreateForm.set(true);
  }

  openEditForm(board: Board): void {
    this.editingBoard.set(board);

    this.boardForm.reset({
      title: board.title,
      description: board.description || '',
      color: board.color,
      background_theme: board.background_theme
    });

    this.showCreateForm.set(true);
  }

  closeForm(): void {
    this.showCreateForm.set(false);
    this.editingBoard.set(null);

    this.boardForm.reset({
      title: '',
      description: '',
      color: '#2563eb',
      background_theme: 'Azul'
    });
  }

  saveBoard(): void {
    if (this.boardForm.invalid) {
      this.boardForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const { title, description, color, background_theme } = this.boardForm.getRawValue();

    const boardData = {
      title: title!,
      description: description || null,
      color: color!,
      background_theme: background_theme!
    };

    const boardToEdit = this.editingBoard();

    if (boardToEdit) {
      this.boardService.updateBoard(boardToEdit.id, boardData).subscribe({
        next: (response) => {
          this.boards.update(currentBoards =>
            currentBoards.map(board =>
              board.id === response.board.id ? response.board : board
            )
          );

          this.isSaving.set(false);
          this.closeForm();
        },
        error: (error) => {
          console.error('Error editando tablero', error);
          this.errorMessage.set(error.error?.message || 'No se pudo editar el tablero');
          this.isSaving.set(false);
        }
      });

      return;
    }

    this.boardService.createBoard(boardData).subscribe({
      next: (response) => {
        this.boards.update(currentBoards => [response.board, ...currentBoards]);

        this.isSaving.set(false);
        this.closeForm();
      },
      error: (error) => {
        console.error('Error creando tablero', error);
        this.errorMessage.set(error.error?.message || 'No se pudo crear el tablero');
        this.isSaving.set(false);
      }
    });
  }

  deleteBoard(board: Board): void {
    const confirmed = confirm(`¿Seguro que quieres eliminar el tablero "${board.title}"?`);

    if (!confirmed) {
      return;
    }

    this.boardService.deleteBoard(board.id).subscribe({
      next: () => {
        this.boards.update(currentBoards =>
          currentBoards.filter(currentBoard => currentBoard.id !== board.id)
        );
      },
      error: (error) => {
        console.error('Error eliminando tablero', error);
        this.errorMessage.set(error.error?.message || 'No se pudo eliminar el tablero');
      }
    });
  }
}