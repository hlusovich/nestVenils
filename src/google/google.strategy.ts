import {PassportStrategy} from '@nestjs/passport';
import {Strategy, VerifyCallback} from 'passport-google-oauth20';
import {config} from 'dotenv';
import {ConfigService} from "@nestjs/config";
import {Injectable} from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(private  configService: ConfigService) {
        super({
            clientID: configService.get("CLIENT_ID"),
            clientSecret: configService.get("CLIENT_SECRET"),
            callbackURL: `http://localhost:${configService.get("PORT") || 5000}/auth/google/callback`,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const {name, emails, photos} = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }
}
