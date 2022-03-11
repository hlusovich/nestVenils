import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {ProfileService} from "../Profile/profile.service";
import {ProfileDocument} from "../schemas/profile.schema";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService, private profileService: ProfileService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("SECRET_KEY"),
        });
    }

    async validate(payload: { email: string }) {
        const user: ProfileDocument | void = await this.profileService.getProfileByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException("this user doesn't exist");
        }
        return {email: payload.email};
    }
}
