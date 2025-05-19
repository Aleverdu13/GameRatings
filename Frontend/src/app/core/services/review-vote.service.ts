import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../../interfaces/review.interface';
import { ReviewVoteSummary } from '../../interfaces/review-vote.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewVoteService {

  private apiUrl = 'http://localhost:8000/api/reviews';

  constructor(private http: HttpClient) {}

  vote(reviewId: number, vote: 1 | -1): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reviewId}/vote`, { vote });
  }

  getVotes(reviewId: number): Observable<ReviewVoteSummary> {
    return this.http.get<ReviewVoteSummary>(
      `${this.apiUrl}/${reviewId}/votes`
    );
  }
}
