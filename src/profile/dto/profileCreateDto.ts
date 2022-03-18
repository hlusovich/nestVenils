import { IProfileCreateDto } from '../Profile.interface';
import { IsEmail, IsString, Validate } from 'class-validator';

import { CustomDateValidator } from '../../validators/dateValidator';
import {ApiProperty} from "@nestjs/swagger";

export class ProfileCreateDto implements IProfileCreateDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Validate(CustomDateValidator)
  birthDate: string;
}
