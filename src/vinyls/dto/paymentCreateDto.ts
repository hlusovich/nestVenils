import { IsInt, IsString } from 'class-validator';
import { IPaymentCreateDto, IVinylCreateDto } from '../vinyls.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentCreateDto implements IPaymentCreateDto {
  @ApiProperty()
  @IsString()
  number: string; // '4242424242424242',

  @ApiProperty()
  @IsString()
  exp_month: string;

  @ApiProperty()
  @IsString()
  exp_year: string;

  @ApiProperty()
  @IsString()
  cvc: string;

  @ApiProperty()
  @IsString()
  payment_method: string; //"pm_card_us"
}
