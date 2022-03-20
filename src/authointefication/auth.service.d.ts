/// <reference types="node" />
import { JwtService } from '@nestjs/jwt';
import { IAuthService, Token } from './auth.interface';
import { ProfileService } from '../Profile/profile.service';
import { ProfileCreateDto } from '../Profile/dto/profileCreateDto';
import { IProfileCreateDtoWithSSO, ProfileForRequest } from '../Profile/Profile.interface';
import { ProfileDocument } from '../schemas/profile.schema';
import { Buffer } from 'buffer';
export declare class AuthService implements IAuthService {
    private jwtService;
    private profileService;
    constructor(jwtService: JwtService, profileService: ProfileService);
    login(user: ProfileDocument): Promise<Token>;
    register(profileDto: ProfileCreateDto, avatar?: Buffer): Promise<ProfileForRequest>;
    registerWithSSO(profileDto: IProfileCreateDtoWithSSO): Promise<Token>;
}
