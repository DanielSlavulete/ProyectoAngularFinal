import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Note {
  id: string;
  board_id: string;
  title: string;
  content: string | null;
  color: string;
  order_index: number;
  check_items_count: number;
  created_at: string;
  updated_at: string;
}

interface NotesResponse {
  notes: Note[];
}

interface NoteResponse {
  note: Note;
}

interface CreateNoteData {
  title: string;
  content?: string | null;
  color?: string;
}

interface ReorderNoteData {
  id: string;
  order_index: number;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getNotesByBoard(boardId: string) {
    return this.http.get<NotesResponse>(`${this.apiUrl}/boards/${boardId}/notes`);
  }

  createNote(boardId: string, data: CreateNoteData) {
    return this.http.post<NoteResponse>(`${this.apiUrl}/boards/${boardId}/notes`, data);
  }

  updateNote(noteId: string, data: CreateNoteData) {
    return this.http.put<NoteResponse>(`${this.apiUrl}/notes/${noteId}`, data);
  }

  deleteNote(noteId: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/notes/${noteId}`);
  }

  reorderNotes(notes: ReorderNoteData[]) {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/notes/reorder`, {
      notes
    });
  }

}