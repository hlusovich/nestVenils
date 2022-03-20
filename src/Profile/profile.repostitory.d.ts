/// <reference types="node" />
import { IProfileCreateDto, IProfileCreateDtoForUpdate, IProfileCreateDtoWithSSO, IProfileRepository } from './Profile.interface';
import { ProfileDocument } from '../schemas/profile.schema';
import { Model } from 'mongoose';
import { Buffer } from 'buffer';
import { IReview } from '../reviews/review.interfaces';
import { IBoughtedVinyl } from '../boughtedVinyls/boughtedVinyl.interfaces';
export declare class ProfileRepository implements IProfileRepository {
    private profileModel;
    constructor(profileModel: Model<ProfileDocument>);
    getAllProfiles(): Promise<ProfileDocument[]>;
    saveProfile(profileData: IProfileCreateDto | IProfileCreateDtoWithSSO): Promise<ProfileDocument>;
    getProfileById(id: string): Promise<ProfileDocument | null>;
    getProfileByEmail(email: string): Promise<ProfileDocument | null>;
    deleteProfile(id: string): Promise<void>;
    updateProfile(id: string, newData: IProfileCreateDtoForUpdate, avatar?: Buffer): Promise<void>;
    addReview(id: string, review: IReview): Promise<void>;
    buyVinyl(id: string, boughtVinyl: IBoughtedVinyl): Promise<void>;
}
