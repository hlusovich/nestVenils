import { IsEmail, IsString } from 'class-validator';
import { ILoginCreateDto } from '../auth.interface';

export class LoginCreateDto implements ILoginCreateDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
