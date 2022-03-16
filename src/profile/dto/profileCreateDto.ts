import { IProfileCreateDto } from '../Profile.interface';
import { IsEmail, IsString, Validate } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { CustomDateValidator } from '../../validators/dateValidator';

export class ProfileCreateDto implements IProfileCreateDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @Validate(CustomDateValidator)
  birthDate: string;
}
