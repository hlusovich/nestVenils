/// <reference types="multer" />
import { AuthService } from './auth.service';
import { LoginCreateDto } from './dto/loginCreateDto';
import { ProfileCreateDto } from '../Profile/dto/profileCreateDto';
import { ProfileForRequest } from '../Profile/Profile.interface';
import { ProfileService } from '../Profile/profile.service';
import { Token } from './auth.interface';
export declare class AuthController {
    private authService;
    private profileService;
    constructor(authService: AuthService, profileService: ProfileService);
    login(loginDto: LoginCreateDto): Promise<Token>;
    register(avatar: Express.Multer.File, profileDto: ProfileCreateDto): Promise<ProfileForRequest>;
}
