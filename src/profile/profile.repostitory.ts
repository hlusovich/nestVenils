import {
    IProfileCreateDto,
    IProfileCreateDtoForUpdate,
    IProfileCreateDtoWithSSO,
    IProfileRepository,
} from './Profile.interface';
import {Injectable} from '@nestjs/common';
import {Profile, ProfileDocument} from '../schemas/profile.schema';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {v4} from 'uuid';
import {Buffer} from 'buffer';
import {IReview} from '../reviews/review.interfaces';
import {IBoughtedVinyl} from '../boughtedVinyls/boughtedVinyl.interfaces';

@Injectable()
export class ProfileRepository implements IProfileRepository {
    constructor(
        @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>
    ) {
    }

    async getAllProfiles(): Promise<ProfileDocument[]> {
        const profiles: ProfileDocument[] = await this.profileModel.find();
        return profiles;
    }

    async saveProfile(
        profileData: IProfileCreateDto | IProfileCreateDtoWithSSO
    ): Promise<ProfileDocument> {
        const id: string = v4();
        const profile: ProfileDocument = new this.profileModel({id, ...profileData});
        await profile.save();
        return profile;
    }

    async getProfileById(id: string): Promise<ProfileDocument | null> {
        const user: ProfileDocument | null = await this.profileModel.findOne({id});
        return user;
    }

    async getProfileByEmail(email: string): Promise<ProfileDocument | null> {
        const user: ProfileDocument | null = await this.profileModel.findOne({email});
        return user;
    }

    async updateProfile(
        id: string,
        newData: IProfileCreateDtoForUpdate,
        avatar?: Buffer
    ): Promise<void> {
        await this.profileModel.updateOne({id}, newData, avatar);
    }

    async addReview(id: string, review: IReview): Promise<void> {
        const profile: ProfileDocument | null = await this.getProfileById(id);
        if (profile) {
            const reviews: IReview[] = profile.reviews;
            reviews.push(review);
            await this.profileModel.updateOne({id}, {reviews});
        }
    }

    async buyVinyl(id: string, boughtVinyl: IBoughtedVinyl): Promise<void> {
        const profile: ProfileDocument | null = await this.getProfileById(id);
        if (profile) {
            const boughtedVinyls: IBoughtedVinyl[] = profile.boughtedVinyls;
            boughtedVinyls.push(boughtVinyl);
            await this.profileModel.updateOne({id}, {boughtedVinyls});
        }
    }
}
