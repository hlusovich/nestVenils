import { IsString } from 'class-validator';
import { IReviewCreateDto } from '../review.interfaces';

export class ReviewCreateDto implements IReviewCreateDto {
  @IsString()
  comment: string;

  @IsString()
  vinylScore: string;
}
