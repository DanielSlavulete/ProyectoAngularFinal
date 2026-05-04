import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

interface HealthResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiHealthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  checkHealth() {
    return this.http.get<HealthResponse>(`${this.apiUrl}/health`);
  }
}