import { IsEmail, IsString } from 'class-validator';
import { ILoginCreateDto } from '../auth.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCreateDto implements ILoginCreateDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
