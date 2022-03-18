import {  IsString } from 'class-validator';
import { IVinylCreateDto } from '../vinyls.interface';
import {ApiProperty} from "@nestjs/swagger";

export class VinylsCreateDto implements IVinylCreateDto {
  @ApiProperty()
  @IsString()
  price: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  author: string;
  @ApiProperty()
  @IsString()
  description: string;
}
