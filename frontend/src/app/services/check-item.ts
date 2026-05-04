import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface CheckItem {
  id: string;
  note_id: string;
  text: string;
  is_checked: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface CheckItemsResponse {
  checkItems: CheckItem[];
}

interface CheckItemResponse {
  checkItem: CheckItem;
}

interface CreateCheckItemData {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckItemService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getCheckItemsByNote(noteId: string) {
    return this.http.get<CheckItemsResponse>(`${this.apiUrl}/notes/${noteId}/check-items`);
  }

  createCheckItem(noteId: string, data: CreateCheckItemData) {
    return this.http.post<CheckItemResponse>(`${this.apiUrl}/notes/${noteId}/check-items`, data);
  }

  updateCheckItem(checkItemId: string, data: CreateCheckItemData) {
    return this.http.put<CheckItemResponse>(`${this.apiUrl}/check-items/${checkItemId}`, data);
  }

  toggleCheckItem(checkItemId: string) {
    return this.http.patch<CheckItemResponse>(`${this.apiUrl}/check-items/${checkItemId}/toggle`, {});
  }

  deleteCheckItem(checkItemId: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/check-items/${checkItemId}`);
  }
}