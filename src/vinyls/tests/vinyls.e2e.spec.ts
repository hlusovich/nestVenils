import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {ProfileController} from "../../profile/profile.controller";
import {VinylsController} from "../vinyls.controller";
import {VinylsService} from "../vinyls.service";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ProfileService} from "../../profile/profile.service";
import Stripe from 'stripe';
import {v4} from "uuid";
import {IPaymentCreateDto, IVinylCreateDto} from "../vinyls.interface";
import {ParseJWTInterceptor} from "../../interceptors/parseJWT.interceptor";
import {MockInterceptor} from "../../interceptors/tests/mock.interceptor";
import {isTokenGuard} from "../../guards/isTokenGuard";
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
import {RoleGuard} from "../../guards/RoleGuard";
import {IReviewCreateDto} from "../../reviews/review.interfaces";
import {IsString} from "class-validator";
import * as dotenv from "dotenv"
import {mockProfileReporistory} from "../../profile/dto/tests/profile.mocks";
import {NotificationService} from "../../notification/notification.service";
import {MailerModule, MailerService} from "@nestjs-modules/mailer";
import {mailerConfig} from "../../mailerConfig";

describe('Vinyls', () => {
    dotenv.config();
    let app: INestApplication;
    let vinylsService = {
        getAllVinyls: () => [{author: "A", price: 40, name: "Jon Lenon"},
            {author: "AB", price: 10, name: "Jon Lenon"},
            {author: "B", price: 56, name: "Marti Lenon"},],
        getVinylById: (id: string) => {
            return {id, price: "2500"}
        },
        saveVinyl: (vinylDto: IVinylCreateDto) => vinylDto,
        addVinylsReview: (id: string): string => {
            return id;
        },
    };
    let configService = {
        get: jest.fn(() => {
            return process.env.STRIPE_KEY
        })
    };
    let notificationService = {
        sentNotification: jest.fn(() => {
        })
    };
    let profileService = {
        getProfileByEmail: (email: string) => {
            return {email, id: "testId"}
        }, buyVynil: (id: string) => {
            return {id}
        }
    };
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule,  MailerModule.forRootAsync(mailerConfig),],
            controllers: [VinylsController],
            providers: [VinylsService, ProfileService, NotificationService]
        })
            .overrideProvider(VinylsService)
            .useValue(vinylsService)
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
            .overrideGuard(ConfigService)
            .useValue(configService)
            .overrideGuard(NotificationService)
            .useValue(notificationService)
            .compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/GET api/vinyls/`, () => {
        return request(app.getHttpServer())
            .get('/api/vinyls/')
            .expect(200)
            .expect(
                vinylsService.getAllVinyls(),
            );
    });
    it(`/GET api/vinyls/?name`, () => {
        const name = "Jon";
        return request(app.getHttpServer())
            .get(`/api/vinyls/?name=${name}`)
            .expect(200)
            .expect(
                vinylsService.getAllVinyls().filter((vinyl) => vinyl.name.includes(name))
            );
    });
    it(`/GET api/vinyls/?author`, () => {
        const author = "A";
        return request(app.getHttpServer())
            .get(`/api/vinyls/?author=${author}`)
            .expect(200)
            .expect(
                vinylsService.getAllVinyls().filter((vinyl) => vinyl.author.includes(author))
            );
    });
    it(`/GET api/vinyls/?price`, () => {
        const price = true;
        return request(app.getHttpServer())
            .get(`/api/vinyls/?price=${price}`)
            .expect(200)
            .expect(
                vinylsService.getAllVinyls().sort((a, b) => +a.price - +b.price)
            );
    });
    it(`/GET api/vinyls/id`, () => {
        const id = v4();
        return request(app.getHttpServer())
            .get(`/api/vinyls/${id}`)
            .expect(200)
            .expect(
                vinylsService.getVinylById(id)
            );
    });
    it(`/POST api/vinyls without auth`, () => {
        return request(app.getHttpServer())
            .post(`/api/vinyls`)
            .expect(400)
    });
    it(`/POST api/vinyls`, () => {
        const vinylDto: IVinylCreateDto = {
            name: "test",
            price: "test",
            author: "test",
            description: "test",
        };
        return request(app.getHttpServer())
            .post(`/api/vinyls`)
            .send(vinylDto)
            .expect(201).expect(
                vinylsService.saveVinyl(vinylDto)
            );

    });

    it(`/POST api/vinyls/:id/reviews`, () => {
        const vinylDto: IVinylCreateDto = {
            name: "test",
            price: "test",
            author: "test",
            description: "test",
        };
        const reviewDto: IReviewCreateDto = {
            comment: "string",
            vinylScore: "5",
        };
        const id: string = v4();
        return request(app.getHttpServer())
            .post(`/api/vinyls/${id}/reviews`)
            .set({authorization: "1"})
            .send(reviewDto)
            .expect(201).expect(
                vinylsService.getVinylById(id)
            );

    });
    it(`/POST api/vinyls/:id/buy-vinyl`, async () => {
        const paymentDto: IPaymentCreateDto = {
            number: '4242424242424242',
            exp_month: "6",
            exp_year: "2022",
            cvc: "314",
            payment_method: "pm_card_us"
        };
        const id: string = v4();
        const email = "testemail@gmail.com";
        await request(app.getHttpServer())
            .post(`/api/vinyls/${id}/buy-vinyl`)
            .set({authorization: email})
            .send(paymentDto)
            .expect(201).expect(
                profileService.buyVynil(profileService.getProfileByEmail(email).id)
            );
        expect(notificationService.sentNotification).toHaveBeenCalledTimes(1);
    }, 60000);

    afterAll(async () => {
        await app.close();
    });
});
