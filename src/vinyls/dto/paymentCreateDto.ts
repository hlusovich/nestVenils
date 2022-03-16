import { IsInt, IsString } from 'class-validator';
import {IPaymentCreateDto, IVinylCreateDto} from '../vinyls.interface';

export class PaymentCreateDto implements IPaymentCreateDto {
  @IsString()
  number: string; // '4242424242424242',
  @IsString()
  exp_month: string;
  @IsString()
  exp_year: string;
  @IsString()
  cvc: string;
  @IsString()
  payment_method: string; //"pm_card_us"



}
