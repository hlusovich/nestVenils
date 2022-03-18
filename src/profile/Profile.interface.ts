import { ProfileDocument } from '../schemas/profile.schema';
import { Buffer } from 'buffer';
import { IReview } from '../reviews/review.interfaces';
import { Role } from '../models/role.enum';
import { IBoughtedVinyl } from '../boughtedVinyls/boughtedVinyl.interfaces';

export interface IProfileCreateDto {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  birthDate: string;
  avatar?: Buffer | string;
}

export interface IProfile {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  birthDate: string;
  avatar?: Buffer | string;
  boughtedVinyls: IBoughtedVinyl[];
  reviews: IReview[];
  role: Role;
  id: string;
}

export interface IProfileCreateDtoWithSSO {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface IRequestUserWithSSO {
  authorization: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    picture: string;
  };
}

export interface ProfileForRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  avatar?: string;
  boughtedVinyls: IBoughtedVinyl[];
  reviews: IReview[];
  role: Role;
}

export interface IProfileCreateDtoForUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface IProfileService {
  getAllProfiles(): Promise<ProfileForRequest[]>;

  getProfileById(id: string): Promise<ProfileForRequest>;

  saveProfile(userData: IProfileCreateDto): Promise<ProfileForRequest>;

  getProfileByEmail(email: string): Promise<ProfileDocument | null>;

  updateProfile(
    id: string,
    newData: IProfileCreateDtoForUpdate,
    email: string,
    avatar: Buffer
  ): Promise<ProfileForRequest | void>;

  getProfileData(user: ProfileDocument): ProfileForRequest;
}

export interface IProfileRepository {
  getAllProfiles(): Promise<ProfileDocument[]>;

  saveProfile(userData: IProfileCreateDto): Promise<ProfileDocument>;

  getProfileById(id: string): Promise<ProfileDocument | null>;

  getProfileByEmail(email: string): Promise<ProfileDocument | null>;

  updateProfile(
    id: string,
    newData: IProfileCreateDtoForUpdate,
    avatar: Buffer
  ): Promise<void>;
}
