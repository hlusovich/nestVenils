import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { VinylsController } from '../vinyls.controller';
import { VinylsService } from '../vinyls.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileService } from '../../profile/profile.service';
import { v4 } from 'uuid';
import { IPaymentCreateDto, IVinylCreateDto } from '../vinyls.interface';
import { ParseJWTInterceptor } from '../../interceptors/parseJWT.interceptor';
import { MockInterceptor } from '../../interceptors/tests/mock.interceptor';
import { isTokenGuard } from '../../guards/isTokenGuard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RoleGuard } from '../../guards/RoleGuard';
import { IReviewCreateDto } from '../../reviews/review.interfaces';
import * as dotenv from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from '../../notification/notification.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { mailerConfig } from '../../mailerConfig';
import { mockNotificationService } from '../../notification/tests/notifications.mock';
import { JwtModuleConfigAsync } from '../../authointefication/jwtAsyncConfig';
import { JwtStrategy } from '../../guards/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../models/role.enum';

describe('Vinyls', () => {
  const email = 'testemail@gmail.com';
  dotenv.config();
  let app: INestApplication;
  let appWithAuth: INestApplication;
  let jwtService: JwtService;
  const vinylsService = {
    getAllVinyls: () => [
      { author: 'A', price: 40, name: 'Jon Lenon' },
      { author: 'AB', price: 10, name: 'Jon Lenon' },
      { author: 'B', price: 56, name: 'Marti Lenon' },
    ],
    getVinylById: (id: string) => {
      return { id, price: '2500' };
    },
    saveVinyl: (vinylDto: IVinylCreateDto) => vinylDto,
    addVinylsReview: (id: string): string => {
      return id;
    },
  };
  const configService = {
    get: jest.fn(() => {
      return process.env.STRIPE_KEY;
    }),
  };
  const profileService = {
    getProfileByEmail: (email: string) => {
      return { email, id: 'testId' };
    },
    buyVynil: (id: string) => {
      return { id };
    },
  };
  const mailerService = {
    sendMail: (payload: { to: string }) => {
      return payload.to;
    },
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, MailerModule.forRootAsync(mailerConfig)],
      controllers: [VinylsController],
      providers: [VinylsService, ProfileService, NotificationService],
    })
      .overrideProvider(VinylsService)
      .useValue(vinylsService)
      .overrideProvider(ProfileService)
      .useValue(profileService)
      .overrideProvider(MailerService)
      .useValue(mailerService)
      .overrideInterceptor(ParseJWTInterceptor)
      .useValue(MockInterceptor)
      .overrideGuard(isTokenGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .overrideProvider(NotificationService)
      .useValue(mockNotificationService)
      .compile();
    const moduleAuthRef = await Test.createTestingModule({
      imports: [
        ConfigModule,
        MailerModule.forRootAsync(mailerConfig),
        JwtModule.registerAsync(JwtModuleConfigAsync),
      ],
      controllers: [VinylsController],
      providers: [
        VinylsService,
        ProfileService,
        NotificationService,
        JwtStrategy,
      ],
    })
      .overrideProvider(VinylsService)
      .useValue(vinylsService)
      .overrideProvider(ProfileService)
      .useValue(profileService)
      .overrideProvider(MailerService)
      .useValue(mailerService)
      .overrideProvider(ConfigService)
      .useValue(configService)
      .overrideProvider(NotificationService)
      .useValue(mockNotificationService)
      .compile();
    app = moduleRef.createNestApplication();
    appWithAuth = moduleAuthRef.createNestApplication();
    jwtService = moduleAuthRef.get<JwtService>(JwtService);
    await app.init();
    await appWithAuth.init();
  });

  it(`/GET api/vinyls/`, () => {
    return request(app.getHttpServer())
      .get('/api/vinyls/')
      .expect(200)
      .expect(vinylsService.getAllVinyls());
  });
  it(`/GET api/vinyls/?name`, () => {
    const name = 'Jon';
    return request(app.getHttpServer())
      .get(`/api/vinyls/?name=${name}`)
      .expect(200)
      .expect(
        vinylsService
          .getAllVinyls()
          .filter((vinyl) => vinyl.name.includes(name))
      );
  });
  it(`/GET api/vinyls/?author`, () => {
    const author = 'A';
    return request(app.getHttpServer())
      .get(`/api/vinyls/?author=${author}`)
      .expect(200)
      .expect(
        vinylsService
          .getAllVinyls()
          .filter((vinyl) => vinyl.author.includes(author))
      );
  });
  it(`/GET api/vinyls/?price`, () => {
    const price = true;
    return request(app.getHttpServer())
      .get(`/api/vinyls/?price=${price}`)
      .expect(200)
      .expect(vinylsService.getAllVinyls().sort((a, b) => +a.price - +b.price));
  });
  it(`/GET api/vinyls/id`, () => {
    const id = v4();
    return request(app.getHttpServer())
      .get(`/api/vinyls/${id}`)
      .expect(200)
      .expect(vinylsService.getVinylById(id));
  });
  it(`/POST api/vinyls without body`, () => {
    return request(app.getHttpServer()).post(`/api/vinyls`).expect(400);
  });
  it(`/POST api/vinyls`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    return request(app.getHttpServer())
      .post(`/api/vinyls`)
      .send(vinylDto)
      .expect(201)
      .expect(vinylsService.saveVinyl(vinylDto));
  });

  it(`/POST api/vinyls/:id/reviews`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    const reviewDto: IReviewCreateDto = {
      comment: 'string',
      vinylScore: '5',
    };
    const id: string = v4();
    const token: string =
      'Bearer ' + jwtService.sign({ email, role: Role.USER });
    return request(app.getHttpServer())
      .post(`/api/vinyls/${id}/reviews`)
      .set({ authorization: token })
      .send(reviewDto)
      .expect(201)
      .expect(vinylsService.getVinylById(id));
  });
  it(`/POST api/vinyls/:id/buy-vinyl`, async () => {
    const paymentDto: IPaymentCreateDto = {
      number: '4242424242424242',
      exp_month: '6',
      exp_year: '2022',
      cvc: '314',
      payment_method: 'pm_card_us',
    };
    const id: string = v4();
    await request(app.getHttpServer())
      .post(`/api/vinyls/${id}/buy-vinyl`)
      .set({ authorization: email })
      .send(paymentDto)
      .expect(201)
      .expect(
        profileService.buyVynil(profileService.getProfileByEmail(email).id)
      );
  }, 60000);
  it(`/POST api/vinyls with auth`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    const token: string =
      'Bearer ' + jwtService.sign({ email, role: Role.ADMIN });
    return request(appWithAuth.getHttpServer())
      .post(`/api/vinyls`)
      .set({ authorization: token })
      .send(vinylDto)
      .expect(201)
      .expect(vinylsService.saveVinyl(vinylDto));
  });
  it(`/POST api/vinyls with auth with invalid role`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    const token: string =
      'Bearer ' + jwtService.sign({ email, role: Role.USER });
    return request(appWithAuth.getHttpServer())
      .post(`/api/vinyls`)
      .set({ authorization: token })
      .send(vinylDto)
      .expect(403);
  });
  it(`/POST api/vinyls with auth without token`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    return request(appWithAuth.getHttpServer())
      .post(`/api/vinyls`)
      .send(vinylDto)
      .expect(401);
  });
  it(`/POST api/vinyls/:id/reviews with auth`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    const reviewDto: IReviewCreateDto = {
      comment: 'string',
      vinylScore: '5',
    };
    const id: string = v4();
    const token: string =
      'Bearer ' + jwtService.sign({ email, role: Role.USER });
    return request(appWithAuth.getHttpServer())
      .post(`/api/vinyls/${id}/reviews`)
      .set({ authorization: token })
      .send(reviewDto)
      .expect(201)
      .expect(vinylsService.getVinylById(id));
  });
  it(`/POST api/vinyls/:id/reviews with auth`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    const reviewDto: IReviewCreateDto = {
      comment: 'string',
      vinylScore: '5',
    };
    const id: string = v4();
    return request(appWithAuth.getHttpServer())
      .post(`/api/vinyls/${id}/reviews`)
      .send(reviewDto)
      .expect(401);
  });
  it(`/POST api/vinyls/:id/buy-vinyl with auth`, () => {
    const vinylDto: IVinylCreateDto = {
      name: 'test',
      price: 'test',
      author: 'test',
      description: 'test',
    };
    const reviewDto: IReviewCreateDto = {
      comment: 'string',
      vinylScore: '5',
    };
    const id: string = v4();
    return request(appWithAuth.getHttpServer())
      .post(`/api/vinyls/${id}/buy-vinyl`)
      .send(reviewDto)
      .expect(401);
  });
  it(`/POST api/vinyls/:id/buy-vinyl`, async () => {
    const paymentDto: IPaymentCreateDto = {
      number: '4242424242424242',
      exp_month: '6',
      exp_year: '2022',
      cvc: '314',
      payment_method: 'pm_card_us',
    };
    const id: string = v4();
    const token: string =
      'Bearer ' + jwtService.sign({ email, role: Role.USER });
    await request(appWithAuth.getHttpServer())
      .post(`/api/vinyls/${id}/buy-vinyl`)
      .set({ authorization: token })
      .send(paymentDto)
      .expect(201)
      .expect(
        profileService.buyVynil(profileService.getProfileByEmail(email).id)
      );
  }, 60000);
  afterAll(async () => {
    await app.close();
    await appWithAuth.close();
  });
});
