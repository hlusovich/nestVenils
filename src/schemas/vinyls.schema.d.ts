/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
import { Document } from 'mongoose';
import { IReview } from '../reviews/review.interfaces';
export declare type VinylDocument = Vinyl & Document;
export declare class Vinyl {
    id: string;
    price: string;
    name: string;
    author: string;
    description: string;
    image: string;
    reviews: IReview[];
}
export declare const VinylSchema: import("mongoose").Schema<Document<Vinyl, any, any>, import("mongoose").Model<Document<Vinyl, any, any>, any, any, any>, any, any>;
