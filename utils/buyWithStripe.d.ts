import { IPaymentCreateDto } from "../src/vinyls/vinyls.interface";
export declare function buyWithStripe(email: string, payment: IPaymentCreateDto, stripeKey: string, goodsPrice: number): Promise<void>;
