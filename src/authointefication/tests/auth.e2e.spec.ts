import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {v4} from "uuid";
import {JwtModuleConfigAsync} from "../jwtAsyncConfig";
import {ProfileModule} from "../../profile/profile.module";
import {AuthController} from "../auth.controller";
import {AuthService} from "../auth.service";
import {JwtStrategy} from "../../guards/jwt.strategy";
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";
import {ProfileService} from "../../profile/profile.service";
import {ProfileRepository} from "../../profile/profile.repostitory";
import {mockProfileReporistory} from "../../profile/tests/profile.mocks";
import {IProfileCreateDto} from "../../profile/Profile.interface";
import {ILoginCreateDto} from "../auth.interface";
import {Buffer} from "buffer";

describe('Auth', () => {
    const exsistedEmails = ["emailEx@gmail.com"];
    let app: INestApplication;
    const email = "testemail@gmail.com";
    const password = "password";
    const authService = {
        login: ({email, password}: ILoginCreateDto) => {
            return {email}
        }, register: (payload: IProfileCreateDto) => {
            return {email: payload.email}

        },
    };

    const profileService = {
        getProfileByEmail: (email: string) => {
            if(exsistedEmails.includes(email)){
                return undefined
            }
            return {email}
        }
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, ConfigService, ProfileService, ProfileRepository],
            exports: [AuthService],
        })
            .overrideProvider(AuthService)
            .useValue(authService).overrideProvider(ProfileRepository)
            .useValue(mockProfileReporistory).overrideProvider(ProfileRepository)
            .useValue(mockProfileReporistory).overrideProvider(ProfileService)
            .useValue(profileService)
            .compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });
    it(`/POST api/auth/login`, () => {
        return request(app.getHttpServer())
            .post('/api/auth/login')
            .send({email, password})
            .expect(201)
            .expect(
                authService.login({email, password}),
            );
    });

    it(`/POST api/auth/login with email witch already exists`, () => {
        return request(app.getHttpServer())
            .post('/api/auth/login')
            .send({email:exsistedEmails[0], password})
            .expect(401)
    });

    it(`/POST api/auth/login with invalid dto`, () => {
        return request(app.getHttpServer())
            .post('/api/auth/login')
            .send({password})
            .expect(400)

    });

    it(`/POST api/auth/registration`, () => {
        const profileDto: IProfileCreateDto = {
            email,
            password,
            firstName: "Test",
            lastName: "Profile",
            birthDate: "2020-11-11",
        };
        return request(app.getHttpServer())
            .post('/api/auth/registration')
            .send(profileDto)
            .expect(201)
            .expect(
                authService.register(profileDto),
            );
    });

    it(`/POST api/auth/registration with invalid dto`, () => {
        const profileDto: IProfileCreateDto = {
            email,
            password,
            firstName: "Test",
            lastName: "Profile",
            birthDate: "2020-11-11"
        };
        return request(app.getHttpServer())
            .post('/api/auth/registration')
            .send()
            .expect(400)

    });
    afterAll(async () => {
        await app.close();
    });
});
