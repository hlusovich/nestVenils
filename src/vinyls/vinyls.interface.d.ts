import { IReview } from '../reviews/review.interfaces';
export interface IVinylCreateDto {
    price: string;
    name: string;
    author: string;
    description: string;
}
export interface IPaymentCreateDto {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    payment_method: string;
}
export interface IVinyl {
    id: string;
    price: string;
    name: string;
    author: string;
    description: string;
    image?: string;
    reviews: IReview[];
}
export interface IVinylForRequest extends IVinylCreateDto {
    reviews: IReview[];
}
