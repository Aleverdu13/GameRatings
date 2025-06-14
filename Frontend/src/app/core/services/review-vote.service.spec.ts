import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReviewVoteService } from './review-vote.service';

describe('ReviewVoteService', () => {
  let service: ReviewVoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewVoteService]
    });
    service = TestBed.inject(ReviewVoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
