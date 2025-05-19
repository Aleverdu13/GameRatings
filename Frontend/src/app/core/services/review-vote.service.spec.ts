import { TestBed } from '@angular/core/testing';

import { ReviewVoteService } from './review-vote.service';

describe('ReviewVoteService', () => {
  let service: ReviewVoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewVoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
