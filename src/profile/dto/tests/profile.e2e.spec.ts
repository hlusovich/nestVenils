import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {v4} from "uuid";
import {ProfileController} from "../../profile.controller";
import {ProfileService} from "../../profile.service";
import {ParseJWTInterceptor} from "../../../interceptors/parseJWT.interceptor";
import {MockInterceptor} from "../../../interceptors/tests/mock.interceptor";
import {isTokenGuard} from "../../../guards/isTokenGuard";
import {JwtAuthGuard} from "../../../guards/jwt-auth.guard";
import {RoleGuard} from "../../../guards/RoleGuard";


describe('Vinyls', () => {
    let app: INestApplication;
    const email = "testemail@gmail.com";
    let profileService = {
        getProfileByEmail: (email: string) => {
            return {email, id: "testId"}
        }, getAllProfiles: () => {
            return ["all profiles"]

        },
        getProfileById: (id:string) => {
            return {email, id, buffer:""}
        },
        updateProfile:(id:string)=>{
            return {id}
        }
    };
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
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
        app = moduleRef.createNestApplication();
        await app.init();
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
                profileService.getProfileById(id)
            );
    });
    it(`/GET api/profiles/id with incorrect email` , () => {
        const id = v4();
        return request(app.getHttpServer())
            .get(`/api/profiles/${id}`)
            .set({authorization: "email"})
            .expect(400)

    });
    it(`/PATCH api/profiles/id` , () => {
        const id = v4();
        return request(app.getHttpServer())
            .patch(`/api/profiles/${id}`)
            .set({authorization: email})
            .expect(200)
            .expect(
                profileService.updateProfile(id)
            );

    });

    it(`/PATCH api/profiles/id with incorrect email` , () => {
        const id = v4();
        return request(app.getHttpServer())
            .patch(`/api/profiles/${id}`)
            .set({authorization: "email"})
            .expect(400)


    });
    afterAll(async () => {
        await app.close();
    });
});
