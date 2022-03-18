import {
  IProfile,
  IProfileCreateDto,
  IProfileCreateDtoForUpdate,
} from '../Profile.interface';
import { v4 } from 'uuid';
import { IReview } from '../../reviews/review.interfaces';
import { IBoughtedVinyl } from '../../boughtedVinyls/boughtedVinyl.interfaces';
import { Role } from '../../models/role.enum';

export const testProfile1: IProfile = {
  id: v4(),
  firstName: 'Mikita',
  lastName: 'Klusovich',
  password: '42',
  email: 'testemail@gmail.com',
  birthDate: '1111-11-11',
  boughtedVinyls: [],
  reviews: [],
  role: Role.USER,
};
export const testProfile2: IProfile = {
  id: v4(),
  firstName: 'Ilon',
  lastName: 'Mask',
  password: '43',
  email: 'spaceX@gmail.com',
  birthDate: '1111-11-11',
  boughtedVinyls: [],
  reviews: [],
  role: Role.USER,
};
export let profiles: IProfile[] = [];
export function removeProfiles(): void {
  profiles = [];
}

export const mockProfileReporistory = {
  getAllProfiles: jest.fn((): IProfile[] => {
    return profiles;
  }),
  saveProfile: jest.fn((profileData: IProfileCreateDto): IProfile => {
    const id: string = v4();
    const profile: IProfile = {
      id,
      ...profileData,
      role: Role.USER,
      reviews: [],
      boughtedVinyls: [],
    };
    profiles.push(profile);
    return profile;
  }),
  getProfileById: jest.fn((id: string): IProfile | undefined => {
    return profiles.find((profile) => profile.id === id);
  }),

  getProfileByEmail: jest.fn((email: string): IProfile | undefined => {
    return profiles.find((profile) => profile.email === email);
  }),
  updateProfile: jest.fn(
    (id: string, newData: IProfileCreateDtoForUpdate): IProfile | undefined => {
      profiles = profiles.map((profile) => {
        if (profile.id === id) {
          return { ...profile, ...newData };
        }
        return profile;
      });
      return profiles.find((profile) => profile.id === id);
    }
  ),
  addReview: jest.fn((userId: string, review: IReview) => {
    const profile: IProfile | undefined = profiles.find(
      (profile) => profile.id === userId
    );
    if (profile) {
      profile?.reviews.push(review);
    }
  }),
  buyVinyl: jest.fn((userId: string, boughtVinyl: IBoughtedVinyl) => {
    const profile: IProfile | undefined = profiles.find(
      (profile) => profile.id === userId
    );
    if (profile) {
      profile?.boughtedVinyls.push(boughtVinyl);
    }
  }),
};
