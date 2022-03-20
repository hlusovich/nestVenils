/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
import { Document } from 'mongoose';
import { IReview } from '../reviews/review.interfaces';
import { Role } from '../models/role.enum';
import { IBoughtedVinyl } from '../boughtedVinyls/boughtedVinyl.interfaces';
export declare type ProfileDocument = Profile & Document;
export declare class Profile {
    id: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    birthDate: string;
    avatar?: string;
    boughtedVinyls: IBoughtedVinyl[];
    reviews: IReview[];
    role: Role;
}
export declare const ProfileSchema: import("mongoose").Schema<Document<Profile, any, any>, import("mongoose").Model<Document<Profile, any, any>, any, any, any>, any, any>;
