import {  IsString } from 'class-validator';
import { IVinylCreateDto } from '../vinyls.interface';

export class VinylsCreateDto implements IVinylCreateDto {
  @IsString()
  price: string;
  @IsString()
  name: string;
  @IsString()
  author: string;
  @IsString()
  description: string;
}
