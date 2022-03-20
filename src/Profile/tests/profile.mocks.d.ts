/// <reference types="jest" />
import { IProfile, IProfileCreateDto, IProfileCreateDtoForUpdate } from '../Profile.interface';
import { IReview } from '../../reviews/review.interfaces';
import { IBoughtedVinyl } from '../../boughtedVinyls/boughtedVinyl.interfaces';
export declare const testProfile1: IProfile;
export declare const testProfile2: IProfile;
export declare let profiles: IProfile[];
export declare function removeProfiles(): void;
export declare const mockProfileReporistory: {
    getAllProfiles: jest.Mock<IProfile[], []>;
    saveProfile: jest.Mock<IProfile, [profileData: IProfileCreateDto]>;
    getProfileById: jest.Mock<IProfile | undefined, [id: string]>;
    getProfileByEmail: jest.Mock<IProfile | undefined, [email: string]>;
    updateProfile: jest.Mock<IProfile | undefined, [id: string, newData: IProfileCreateDtoForUpdate]>;
    addReview: jest.Mock<void, [userId: string, review: IReview]>;
    buyVinyl: jest.Mock<void, [userId: string, boughtVinyl: IBoughtedVinyl]>;
};
