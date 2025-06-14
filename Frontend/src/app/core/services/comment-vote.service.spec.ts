import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CommentVoteService } from './comment-vote.service';

describe('CommentVoteService', () => {
  let service: CommentVoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentVoteService]
    });
    service = TestBed.inject(CommentVoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
