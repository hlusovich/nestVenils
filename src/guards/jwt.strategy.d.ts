import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../Profile/profile.service';
import { TokenPayload } from '../authointefication/auth.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private profileService;
    constructor(configService: ConfigService, profileService: ProfileService);
    validate(payload: {
        email: string;
        role: string;
    }): Promise<TokenPayload>;
}
export {};
