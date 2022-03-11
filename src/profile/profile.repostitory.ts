import {IProfileCreateDto, IProfileCreateDtoForUpdate, IProfileRepository} from './Profile.interface';
import {Injectable} from "@nestjs/common";
import {Profile, ProfileDocument} from "../schemas/profile.schema";
import {Model} from 'mongoose';
import {InjectModel} from "@nestjs/mongoose";
import {v4} from "uuid";
import {Buffer} from "buffer";


@Injectable()
export class ProfileRepository implements IProfileRepository {

    constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {
    }

    async getAllProfiles(): Promise<ProfileDocument[]> {
        const profiles: ProfileDocument[] = await this.profileModel.find();
        return profiles;
    }


    async saveProfile(userData: IProfileCreateDto): Promise<ProfileDocument> {
        const id: string = v4();
        const profile: ProfileDocument = new this.profileModel({id, ...userData});
        await profile.save();
        return profile;

    };

    async getProfileById(id: string): Promise<ProfileDocument | undefined> {
        const user: ProfileDocument = await this.profileModel.findOne({id});
        return user;

    }

    async getProfileByEmail(email: string): Promise<ProfileDocument | undefined> {
        const user: ProfileDocument = await this.profileModel.findOne({email});
        return user;

    }

    async updateProfile(id: string, newData: IProfileCreateDtoForUpdate,avatar:Buffer): Promise<void> {
        await this.profileModel.updateOne({id}, newData, avatar);
    };
}

