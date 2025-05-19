import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8000/api/reviews';

  constructor(private http: HttpClient) {}

  // Obtiene los comentarios de una reseña en específico
  getComments(reviewId: number, page: number = 1): Observable<{
    data: Comment[];
    current_page: number;
    last_page: number;
  }> {
    return this.http.get<{
      data: Comment[];
      current_page: number;
      last_page: number;
    }>(`${this.apiUrl}/${reviewId}/comments?page=${page}`);
  }

  // Publica un comentario en una reseña
  postComment(reviewId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reviewId}/comments`, { content });
  }

  // Publica un comentario en una reseña con un ID de padre opcional
  addComment(reviewId: number, data: { content: string; parent_id?: number }): Observable<any> {
    return this.http.post<Comment>(`${this.apiUrl}/${reviewId}/comments`, data);
  }

}
