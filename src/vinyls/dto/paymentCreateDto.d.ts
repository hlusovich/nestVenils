import { IPaymentCreateDto } from '../vinyls.interface';
export declare class PaymentCreateDto implements IPaymentCreateDto {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    payment_method: string;
}
