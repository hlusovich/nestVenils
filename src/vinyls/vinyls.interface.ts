import {ReviewDocument} from "../schemas/review.schema";

export interface IVinylCreateDto {
    price: string;
    name: string;
    author: string;
    description: string;
}
export interface IVinylForRequest extends IVinylCreateDto {
    reviews: ReviewDocument[];
}
