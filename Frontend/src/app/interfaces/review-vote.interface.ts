export interface ReviewVote {
    review_id: number;
    user_id: number;
    vote: 1 | -1;
  }

export interface ReviewVoteSummary {
  upvotes: number;
  downvotes: number;
  total: number;
  userVote: 1 | -1 | null;
}
