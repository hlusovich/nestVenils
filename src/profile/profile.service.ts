import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {ProfileRepository} from './profile.repostitory';
import {
    IProfileService,
    IProfileCreateDto,
    IProfileCreateDtoForUpdate,
    ProfileForRequest,
    IProfileCreateDtoWithSSO,
} from './Profile.interface';
import {ProfileDocument} from '../schemas/profile.schema';
import {Buffer} from 'buffer';
import {IReview} from '../reviews/review.interfaces';
import {IBoughtedVinyl} from '../boughtedVinyls/boughtedVinyl.interfaces';

@Injectable()
export class ProfileService implements IProfileService {
    constructor(private profilesRepository: ProfileRepository) {
    }

    async saveProfile(userData: IProfileCreateDto): Promise<ProfileForRequest> {
        const profile: ProfileDocument = await this.profilesRepository.saveProfile(
            userData
        );
        return this.getProfileData(profile);
    }

    async saveProfileWithSSO(
        userData: IProfileCreateDtoWithSSO
    ): Promise<ProfileForRequest> {
        const profile: ProfileDocument = await this.profilesRepository.saveProfile(
            userData
        );
        return this.getProfileData(profile);
    }

    async getAllProfiles(): Promise<ProfileForRequest[]> {
        const profiles: ProfileDocument[] =
            await this.profilesRepository.getAllProfiles();
        const profilesForRequest: ProfileForRequest[] = [];
        for (let i = 0; i < profiles.length; i++) {
            const profile: ProfileForRequest =  this.getProfileData(profiles[i]);
            profilesForRequest.push(profile);
        }
        return profilesForRequest;
    }

     getProfileData(user: ProfileDocument): ProfileForRequest {
        const {
            firstName,
            lastName,
            id,
            email,
            birthDate,
            avatar,
            reviews,
            role,
            boughtedVinyls,
        } = user;
        return {
            firstName,
            email,
            id,
            lastName,
            birthDate,
            avatar,
            boughtedVinyls,
            reviews,
            role,
        };
    }

    async getProfileById(id: string): Promise<ProfileForRequest> {
        const profile: ProfileDocument | null =
            await this.profilesRepository.getProfileById(id);
        if (!profile) {
            throw new BadRequestException("this user doesn't exist");
        }
        return this.getProfileData(profile);
    }

    async getProfileByEmail(email: string): Promise<ProfileDocument | null> {
        const profile: ProfileDocument | null =
            await this.profilesRepository.getProfileByEmail(email);
        return profile;
    }

    async updateProfile(
        id: string,
        newData: IProfileCreateDtoForUpdate,
        email: string,
        avatar?: Buffer
    ): Promise<ProfileForRequest | void> {
        const oldProfileDate: ProfileForRequest = await this.getProfileById(id);
        if (email !== oldProfileDate.email) {
            throw new UnauthorizedException('Invalid token');
        }
        await this.profilesRepository.updateProfile(id, newData, avatar);
        const user: null | ProfileDocument =
            await this.profilesRepository.getProfileById(id);
        if (user) {
            return this.getProfileData(user);
        }
    }

    async addReview(review: IReview): Promise<void> {
        await this.getProfileById(review.userId);
        await this.profilesRepository.addReview(review.userId, review);
    }

    async buyVynil(
        profileId: string,
        boughtedVenil: IBoughtedVinyl
    ): Promise<ProfileForRequest> {
        await this.getProfileById(profileId);
        await this.profilesRepository.buyVinyl(profileId, boughtedVenil);
        const profile: ProfileForRequest = await this.getProfileById(profileId);
        return profile;
    }
}
