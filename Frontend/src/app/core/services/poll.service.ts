import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getPolls(): Observable<any> {
    return this.http.get(`${this.apiUrl}/polls`);
  }

  vote(pollId: number, pollOptionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/polls/vote/${pollOptionId}`, { poll_id: pollId });
  }

  getResults(pollId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${pollId}/results`);
  }
}
