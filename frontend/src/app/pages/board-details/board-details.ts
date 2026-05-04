import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { Board, BoardService } from '../../services/board';
import { Note, NoteService } from '../../services/note';
import { CheckItem, CheckItemService } from '../../services/check-item';

@Component({
  selector: 'app-board-details',
  imports: [RouterLink, DatePipe, ReactiveFormsModule, DragDropModule],
  templateUrl: './board-details.html',
  styleUrl: './board-details.css',
})
export class BoardDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private noteService = inject(NoteService);
  private checkItemService = inject(CheckItemService);
  private fb = inject(FormBuilder);

  board = signal<Board | null>(null);
  notes = signal<Note[]>([]);
  checkItemsByNote = signal<Record<string, CheckItem[]>>({});

  isLoading = signal(false);
  isLoadingNotes = signal(false);
  isSavingNote = signal(false);

  errorMessage = signal('');
  noteErrorMessage = signal('');
  showNoteForm = signal(false);

  editingNote = signal<Note | null>(null);

  noteForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    content: [''],
    color: ['#facc15', [Validators.required]]
  });

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');

    if (!boardId) {
      this.errorMessage.set('No se encontró el tablero');
      return;
    }

    this.loadBoard(boardId);
    this.loadNotes(boardId);
  }

  loadBoard(boardId: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.boardService.getBoard(boardId).subscribe({
      next: (response) => {
        this.board.set(response.board);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando tablero', error);
        this.errorMessage.set(error.error?.message || 'No se pudo cargar el tablero');
        this.isLoading.set(false);
      }
    });
  }

  loadNotes(boardId: string): void {
    this.isLoadingNotes.set(true);
    this.noteErrorMessage.set('');

    this.noteService.getNotesByBoard(boardId).subscribe({
      next: (response) => {
        this.notes.set(response.notes);
        this.loadCheckItemsForNotes(response.notes);
        this.isLoadingNotes.set(false);
      },
      error: (error) => {
        console.error('Error cargando notas', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudieron cargar las notas');
        this.isLoadingNotes.set(false);
      }
    });
  }

  loadCheckItemsForNotes(notes: Note[]): void {
    notes.forEach(note => {
      this.loadCheckItems(note.id);
    });
  }

  loadCheckItems(noteId: string): void {
    this.checkItemService.getCheckItemsByNote(noteId).subscribe({
      next: (response) => {
        this.checkItemsByNote.update(current => ({
          ...current,
          [noteId]: response.checkItems
        }));
      },
      error: (error) => {
        console.error('Error cargando checklist', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudo cargar el checklist');
      }
    });
  }

  getCheckItems(noteId: string): CheckItem[] {
    return this.checkItemsByNote()[noteId] || [];
  }

  createCheckItem(noteId: string, input: HTMLInputElement): void {
    const text = input.value.trim();

    if (text.length < 2) {
      return;
    }

    this.checkItemService.createCheckItem(noteId, { text }).subscribe({
      next: (response) => {
        this.checkItemsByNote.update(current => ({
          ...current,
          [noteId]: [...(current[noteId] || []), response.checkItem]
        }));

        input.value = '';
      },
      error: (error) => {
        console.error('Error creando checklist item', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudo crear el elemento');
      }
    });
  }

  toggleCheckItem(checkItem: CheckItem): void {
    this.checkItemService.toggleCheckItem(checkItem.id).subscribe({
      next: (response) => {
        const noteId = response.checkItem.note_id;

        this.checkItemsByNote.update(current => ({
          ...current,
          [noteId]: (current[noteId] || []).map(item =>
            item.id === response.checkItem.id ? response.checkItem : item
          )
        }));
      },
      error: (error) => {
        console.error('Error actualizando checklist item', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudo actualizar el elemento');
      }
    });
  }

  deleteCheckItem(checkItem: CheckItem): void {
    this.checkItemService.deleteCheckItem(checkItem.id).subscribe({
      next: () => {
        this.checkItemsByNote.update(current => ({
          ...current,
          [checkItem.note_id]: (current[checkItem.note_id] || []).filter(
            item => item.id !== checkItem.id
          )
        }));
      },
      error: (error) => {
        console.error('Error eliminando checklist item', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudo eliminar el elemento');
      }
    });
  }

  openCreateNoteForm(): void {
    this.editingNote.set(null);

    this.noteForm.reset({
      title: '',
      content: '',
      color: '#facc15'
    });

    this.showNoteForm.set(true);
  }

  openEditNoteForm(note: Note): void {
    this.editingNote.set(note);

    this.noteForm.reset({
      title: note.title,
      content: note.content || '',
      color: note.color
    });

    this.showNoteForm.set(true);
  }

  closeNoteForm(): void {
    this.showNoteForm.set(false);
    this.editingNote.set(null);

    this.noteForm.reset({
      title: '',
      content: '',
      color: '#facc15'
    });
  }

  saveNote(): void {
    const currentBoard = this.board();

    if (!currentBoard) {
      return;
    }

    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    this.isSavingNote.set(true);
    this.noteErrorMessage.set('');

    const { title, content, color } = this.noteForm.getRawValue();

    const noteData = {
      title: title!,
      content: content || null,
      color: color!
    };

    const noteToEdit = this.editingNote();

    if (noteToEdit) {
      this.noteService.updateNote(noteToEdit.id, noteData).subscribe({
        next: (response) => {
          this.notes.update(currentNotes =>
            currentNotes.map(note =>
              note.id === response.note.id ? response.note : note
            )
          );

          this.isSavingNote.set(false);
          this.closeNoteForm();
        },
        error: (error) => {
          console.error('Error editando nota', error);
          this.noteErrorMessage.set(error.error?.message || 'No se pudo editar la nota');
          this.isSavingNote.set(false);
        }
      });

      return;
    }

    this.noteService.createNote(currentBoard.id, noteData).subscribe({
      next: (response) => {
        this.notes.update(currentNotes => [...currentNotes, response.note]);

        this.checkItemsByNote.update(current => ({
          ...current,
          [response.note.id]: []
        }));

        this.isSavingNote.set(false);
        this.closeNoteForm();
      },
      error: (error) => {
        console.error('Error creando nota', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudo crear la nota');
        this.isSavingNote.set(false);
      }
    });
  }

  deleteNote(note: Note): void {
    const confirmed = confirm(`¿Seguro que quieres eliminar la nota "${note.title}"?`);

    if (!confirmed) {
      return;
    }

    this.noteService.deleteNote(note.id).subscribe({
      next: () => {
        this.notes.update(currentNotes =>
          currentNotes.filter(currentNote => currentNote.id !== note.id)
        );

        this.checkItemsByNote.update(current => {
          const updated = { ...current };
          delete updated[note.id];
          return updated;
        });
      },
      error: (error) => {
        console.error('Error eliminando nota', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudo eliminar la nota');
      }
    });
  }

  dropNote(event: CdkDragDrop<Note[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const currentNotes = [...this.notes()];

    moveItemInArray(currentNotes, event.previousIndex, event.currentIndex);

    const reorderedNotes = currentNotes.map((note, index) => ({
      ...note,
      order_index: index
    }));

    this.notes.set(reorderedNotes);

    this.noteService.reorderNotes(
      reorderedNotes.map(note => ({
        id: note.id,
        order_index: note.order_index
      }))
    ).subscribe({
      error: (error) => {
        console.error('Error reordenando notas', error);
        this.noteErrorMessage.set(error.error?.message || 'No se pudo guardar el nuevo orden');

        const currentBoard = this.board();

        if (currentBoard) {
          this.loadNotes(currentBoard.id);
        }
      }
    });
  }
}