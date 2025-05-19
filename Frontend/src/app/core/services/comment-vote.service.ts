import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentVoteService {
  private apiUrl = 'http://localhost:8000/api/comments';

  constructor(private http: HttpClient) {}

  getVotes(commentId: number): Observable<{
    upvotes: number;
    downvotes: number;
    total: number;
  }> {
    return this.http.get<{
      upvotes: number;
      downvotes: number;
      total: number;
    }>(`${this.apiUrl}/${commentId}/votes`);
  }

  vote(commentId: number, vote: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${commentId}/vote`, { vote });
  }
}
