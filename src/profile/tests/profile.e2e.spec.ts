import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {BadRequestException, INestApplication} from '@nestjs/common';
import {v4} from "uuid";
import {ProfileController} from "../profile.controller";
import {ProfileService} from "../profile.service";
import {ParseJWTInterceptor} from "../../interceptors/parseJWT.interceptor";
import {MockInterceptor} from "../../interceptors/tests/mock.interceptor";
import {isTokenGuard} from "../../guards/isTokenGuard";
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
import {RoleGuard} from "../../guards/RoleGuard";
import {JwtModuleConfigAsync} from "../../authointefication/jwtAsyncConfig";
import {JwtModule, JwtService} from '@nestjs/jwt';
import {JwtStrategy} from "../../guards/jwt.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {Role} from "../../models/role.enum";
import {config} from "../../app.module";


describe('Profiles', () => {
    let app: INestApplication;
    let appWithAuth: INestApplication;
    let jwtService: JwtService;
    const unexistedId = v4();
    const email = "testemail@gmail.com";
    const icorrectEmail = "testemail@gmail.com";
    let profileService = {
        getProfileByEmail: (email: string) => {
            return {email, id: "testId"}
        }, getAllProfiles: () => {
            return ["all profiles"]
        },
        getProfileById: (id: string) => {
            if (id === unexistedId) {
                return {email: icorrectEmail, id, buffer: ""};
            }
            return {email, id, buffer: ""}
        },
        updateProfile: (id: string): { id: string } => {
            return {id}
        }
    };
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({isGlobal: true, load: [config]})],
            controllers: [ProfileController],
            providers: [ProfileService]
        })
            .overrideProvider(ProfileService)
            .useValue(profileService)
            .overrideInterceptor(ParseJWTInterceptor)
            .useValue(MockInterceptor)
            .overrideGuard(isTokenGuard)
            .useValue({canActivate: () => true})
            .overrideGuard(JwtAuthGuard)
            .useValue({canActivate: () => true})
            .overrideGuard(RoleGuard)
            .useValue({canActivate: () => true})
            .compile();
        const moduleAuthRef = await Test.createTestingModule({
            imports: [ConfigModule, JwtModule.registerAsync(JwtModuleConfigAsync)],
            controllers: [ProfileController],
            providers: [ProfileService, JwtStrategy, ParseJWTInterceptor]
        })
            .overrideProvider(ProfileService)
            .useValue(profileService)
            .compile();
        app = moduleRef.createNestApplication();
        appWithAuth = moduleAuthRef.createNestApplication();
        jwtService = moduleAuthRef.get<JwtService>(JwtService);
        await app.init();
        await appWithAuth.init();
    });

    it(`/GET api/profiles/`, () => {
        return request(app.getHttpServer())
            .get('/api/profiles/')
            .expect(200)
            .expect(
                profileService.getAllProfiles(),
            );
    });
    it(`/GET api/profiles/id`, () => {
        const id = v4();
        return request(app.getHttpServer())
            .get(`/api/profiles/${id}`)
            .set({authorization: email})
            .expect(200)
            .expect(
                profileService.getProfileById(id) as Object
            );
    });
    it(`/GET api/profiles/id with incorrect email`, () => {
        const id = v4();
        return request(app.getHttpServer())
            .get(`/api/profiles/${id}`)
            .set({authorization: "email"})
            .expect(400)

    });
    it(`/PATCH api/profiles/id`, () => {
        const id = v4();
        return request(app.getHttpServer())
            .patch(`/api/profiles/${id}`)
            .set({authorization: email})
            .expect(200)
            .expect(
                profileService.updateProfile(id)
            );

    });

    it(`/PATCH api/profiles/id with incorrect email`, () => {
        const id = v4();
        return request(app.getHttpServer())
            .patch(`/api/profiles/${id}`)
            .set({authorization: "email"})
            .expect(400)


    });
    it(`/GET api/profiles/id auth with no token`, () => {
        const id = v4();
        return request(appWithAuth.getHttpServer())
            .get(`/api/profiles/${id}`)
            .expect(401)

    });
    it(`/GET api/profiles/id auth with incorrect email`, () => {
        const id = v4();
        const token: string = "Bearer " + jwtService.sign({email: "email", role: Role.USER});
        return request(appWithAuth.getHttpServer())
            .get(`/api/profiles/${id}`)
            .set({authorization: token})
            .expect(400)
    });

    it(`/GET api/profiles/id auth `, () => {
        const id = v4();
        const token: string = "Bearer " + jwtService.sign({email, role: Role.USER});
        return request(appWithAuth.getHttpServer())
            .get(`/api/profiles/${id}`)
            .set({authorization: token})
            .expect(200)
    });
    it(`/PATCH api/profiles/id with auth`, async () => {
        const id = v4();
        const token: string = "Bearer " + jwtService.sign({email, role: Role.USER});
        await request(appWithAuth.getHttpServer())
            .patch(`/api/profiles/${id}`)
            .set({authorization: token})
            .expect(200)
            .expect(
                profileService.updateProfile(id)
            );
    });
    it(`/PATCH api/profiles/id with auth without token`, async () => {
        const id = v4();
        await request(appWithAuth.getHttpServer())
            .patch(`/api/profiles/${id}`)
            .expect(401)
    });
    it(`/PATCH api/profiles/id with incorrect token`, async () => {
        const id = v4();
        await request(appWithAuth.getHttpServer())
            .patch(`/api/profiles/${id}`)
            .set({authorization: "token"})
            .expect(401)
    });

    afterAll(async () => {
        await app.close();
    });
});
