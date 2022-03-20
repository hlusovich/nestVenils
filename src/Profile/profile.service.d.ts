/// <reference types="node" />
import { ProfileRepository } from './profile.repostitory';
import { IProfileService, IProfileCreateDto, IProfileCreateDtoForUpdate, ProfileForRequest, IProfileCreateDtoWithSSO } from './Profile.interface';
import { ProfileDocument } from '../schemas/profile.schema';
import { Buffer } from 'buffer';
import { IReview } from '../reviews/review.interfaces';
import { IBoughtedVinyl } from '../boughtedVinyls/boughtedVinyl.interfaces';
export declare class ProfileService implements IProfileService {
    private profilesRepository;
    constructor(profilesRepository: ProfileRepository);
    saveProfile(userData: IProfileCreateDto): Promise<ProfileForRequest>;
    saveProfileWithSSO(userData: IProfileCreateDtoWithSSO): Promise<ProfileForRequest>;
    getAllProfiles(): Promise<ProfileForRequest[]>;
    getProfileData(user: ProfileDocument): ProfileForRequest;
    getProfileById(id: string): Promise<ProfileForRequest>;
    getProfileByEmail(email: string): Promise<ProfileDocument | null>;
    updateProfile(id: string, newData: IProfileCreateDtoForUpdate, email: string, avatar?: Buffer): Promise<ProfileForRequest | void>;
    addReview(review: IReview): Promise<void>;
    buyVynil(profileId: string, boughtedVenil: IBoughtedVinyl): Promise<ProfileForRequest>;
}
