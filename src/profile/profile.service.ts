import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {ProfileRepository} from "./profile.repostitory";
import {
    IProfileService,
    IProfileCreateDto,
    IProfileCreateDtoForUpdate,
    ProfileForRequest
} from "./Profile.interface";
import {NotificationService} from "../Notification/notification.service";
import {ProfileDocument} from "../schemas/profile.schema";
import {BoughtedVinylsService} from "../boughtedVinyls/boughtedVinyls.service";
import {BoughtedVinylsDocument} from "../schemas/boughtedVinyls.schema";
import {ReviewService} from "../reviews/review.service";
import {ReviewDocument} from "../schemas/review.schema";
import {Buffer} from "buffer";

@Injectable()
export class ProfileService implements IProfileService {
    constructor(private profilesRepository: ProfileRepository, private notificationService: NotificationService,
                private boughtedVinylService: BoughtedVinylsService, private reviewService: ReviewService) {
    }

    async saveProfile(userData: IProfileCreateDto): Promise<ProfileForRequest> {
        const profile: ProfileDocument = await this.profilesRepository.saveProfile(userData);
        await this.notificationService.subscribe(profile.id);
        return this.getProfileData(profile);
    }

    async saveProfileWithSSO(userData: IProfileCreateDto): Promise<ProfileForRequest> {
        const profile: ProfileDocument = await this.profilesRepository.saveProfile(userData);
        await this.notificationService.subscribe(profile.id);
        return this.getProfileData(profile);
    }

    async getAllProfiles(): Promise<ProfileForRequest[]> {
        const profiles: ProfileDocument[] = await this.profilesRepository.getAllProfiles();
        let profilesForRequest: ProfileForRequest[] = [];
        for (let i = 0; i < profiles.length; i++) {
            const profile: ProfileForRequest = await this.getProfileData(profiles[i]);
            profilesForRequest.push(profile);
        }
        return profilesForRequest;
    }

    async getProfileData(user: ProfileDocument): Promise<ProfileForRequest> {
        const {firstName, lastName, id, email, birthDate, avatar} = user;
        const boughtedVinyls: BoughtedVinylsDocument[] = await this.boughtedVinylService.getAllProfileVinyls(id);
        const reviews: ReviewDocument[] = await this.reviewService.getAllProfileReviews(id);
        return {firstName, email, id, lastName, birthDate, avatar, boughtedVinyls, reviews};
    }

    async getProfileById(id: string): Promise<ProfileForRequest> {
        const profile: ProfileDocument | undefined = await this.profilesRepository.getProfileById(id);
        if (!profile) {
            throw new BadRequestException('this user doesn\'t exist');
        }
        return this.getProfileData(profile);
    }

    async getProfileByEmail(email: string): Promise<ProfileDocument | undefined> {
        const user: ProfileDocument | undefined = await this.profilesRepository.getProfileByEmail(email);
        return user;
    }

    async updateProfile(id: string, newData: IProfileCreateDtoForUpdate, email: string, avatar:Buffer): Promise<ProfileForRequest | void> {
        const oldProfileDate: ProfileForRequest = await this.getProfileById(id);
        if (!oldProfileDate) {
            throw new BadRequestException('this user doesn\'t exist');
        }
        if (email !== oldProfileDate.email) {
            throw new UnauthorizedException("Invalid token")
        }
        await this.profilesRepository.updateProfile(id, newData, avatar);
        const user: undefined | ProfileDocument = await this.profilesRepository.getProfileById(id);
        return this.getProfileData(user);
    }

}
