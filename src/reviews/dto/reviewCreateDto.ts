import { IsString } from 'class-validator';
import { IReviewCreateDto } from '../review.interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewCreateDto implements IReviewCreateDto {
  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsString()
  vinylScore: string;
}
