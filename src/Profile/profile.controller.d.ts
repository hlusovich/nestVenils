/// <reference types="multer" />
import { ProfileService } from './profile.service';
import { ProfileForRequest } from './Profile.interface';
import { ProfileUpdateDto } from './dto/profileUpdateDto';
import { Request } from 'express-serve-static-core';
export declare class ProfileController {
    private profileService;
    constructor(profileService: ProfileService);
    getAll(): Promise<ProfileForRequest[]>;
    getOne(id: string, req: Request): Promise<ProfileForRequest>;
    update(avatar: Express.Multer.File, profileDto: ProfileUpdateDto, id: string, req: Request): Promise<ProfileForRequest | void>;
}
