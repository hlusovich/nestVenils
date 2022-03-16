export interface IReview {
  id: string;
  comment: string;
  vinylScore: string;
  userId: string;
  vinylId: string;
}

export interface IReviewCreateDto {
  comment: string;
  vinylScore: string;
}
