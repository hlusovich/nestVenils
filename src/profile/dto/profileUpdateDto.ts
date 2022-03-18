import { IProfileCreateDtoForUpdate } from '../Profile.interface';
import { IsOptional, IsString, Validate } from 'class-validator';
import { CustomDateValidator } from '../../validators/dateValidator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileUpdateDto implements IProfileCreateDtoForUpdate {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(CustomDateValidator)
  birthDate?: string;
}
