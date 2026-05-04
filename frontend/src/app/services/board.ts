import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  background_theme: string;
  owner_id: string;
  notes_count: number;
  created_at: string;
  updated_at: string;
}

interface BoardsResponse {
  boards: Board[];
}

interface BoardResponse {
  board: Board;
}

interface CreateBoardData {
  title: string;
  description?: string | null;
  color?: string;
  background_theme?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/boards';

  getBoards() {
    return this.http.get<BoardsResponse>(this.apiUrl);
  }

  getBoard(id: string) {
    return this.http.get<BoardResponse>(`${this.apiUrl}/${id}`);
  }

  createBoard(data: CreateBoardData) {
    return this.http.post<BoardResponse>(this.apiUrl, data);
  }

  updateBoard(id: string, data: CreateBoardData) {
    return this.http.put<BoardResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteBoard(id: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}