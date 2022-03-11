
import {ProfileDocument} from "../schemas/profile.schema";
import {BoughtedVinylsDocument} from "../schemas/boughtedVinyls.schema";
import {ReviewDocument} from "../schemas/review.schema";
import {Buffer} from "buffer";

export interface IProfileCreateDto {
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    avatar?:Buffer
}

export interface ProfileForRequest {
    id: string;
    firstName: string,
    lastName: string,
    email: string
    birthDate:string;
    avatar:string;
    boughtedVinyls:BoughtedVinylsDocument[];
    reviews:ReviewDocument[];
}

export interface IProfileCreateDtoForUpdate {
    firstName?: string,
    lastName?: string,
    email?: string
}

export interface IProfileService {

    getAllProfiles(): Promise<ProfileForRequest[]>;

    getProfileById(id: string): Promise<ProfileForRequest>;

    saveProfile(userData: IProfileCreateDto): Promise<ProfileForRequest>

    getProfileByEmail(email: string): Promise<| ProfileDocument | undefined>;

    updateProfile(id: string, newData: IProfileCreateDtoForUpdate, email: string, avatar:Buffer): Promise<ProfileForRequest | void>

    getProfileData(user:ProfileDocument): Promise<ProfileForRequest>;

}

export interface IProfileRepository {

    getAllProfiles(): Promise<ProfileDocument[]>;

    saveProfile(userData: IProfileCreateDto): Promise<ProfileDocument>;

    getProfileById(id: string): Promise<ProfileDocument | undefined>

    getProfileByEmail(email: string): Promise<ProfileDocument | undefined>

    updateProfile(id: string, newData: IProfileCreateDtoForUpdate, avatar:Buffer): Promise<void>;
}

