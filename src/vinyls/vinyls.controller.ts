import { VinylsService } from './vinyls.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { VinylDocument } from '../schemas/vinyls.schema';
import { VinylsCreateDto } from './dto/vinylsCreateDto';
import { Request } from 'express-serve-static-core';
import { ReviewCreateDto } from '../reviews/dto/reviewCreateDto';
import { ProfileService } from '../profile/profile.service';
import { ProfileDocument } from '../schemas/profile.schema';
import { ParseJWTInterceptor } from '../interceptors/parseJWT.interceptor';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IVinylForRequest } from './vinyls.interface';
import { isTokenGuard } from '../guards/isTokenGuard';
import { ProfileForRequest } from '../profile/Profile.interface';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../models/role.enum';
import { RoleGuard } from '../guards/RoleGuard';
import { ConfigService } from '@nestjs/config';
import { PaymentCreateDto } from './dto/paymentCreateDto';
import { NotificationService } from '../notification/notification.service';
import { buyWithStripe } from '../../utils/buyWithStripe';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Vinyls')
@Controller('api/vinyls/')
export class VinylsController {
  constructor(
    private vinylService: VinylsService,
    private profileService: ProfileService,
    private configService: ConfigService,
    private notificationService: NotificationService
  ) {}

  @ApiResponse({
    status: 200,
    description:
      'get all vinyls which can be ' +
      'sorted by price and filtered by author and name',
  })
  @Get()
  async getAll(
    @Query('price') price: boolean,
    @Query('author') author: string,
    @Query('name') name: string
  ): Promise<IVinylForRequest[]> {
    let vinyls: IVinylForRequest[] = await this.vinylService.getAllVinyls();
    if (price) {
      vinyls = vinyls.sort((a, b) => +a.price - +b.price);
    }
    if (author) {
      vinyls = vinyls.filter((vinyl) => vinyl.author.includes(author));
    }
    if (name) {
      vinyls = vinyls.filter((vinyl) => vinyl.name.includes(name));
    }
    return vinyls;
  }

  @ApiResponse({ status: 200, description: 'get  vinyl by id' })
  @ApiResponse({
    status: 400,
    description: "if vinyl with this id doesn't exist",
  })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<IVinylForRequest> {
    const vinyl: IVinylForRequest | void = await this.vinylService.getVinylById(
      id
    );
    return vinyl;
  }

  @ApiResponse({ status: 201, description: 'Admin  create  new vinyl' })
  @ApiResponse({ status: 401, description: 'if invalid jwt credentials' })
  @Roles(Role.ADMIN)
  @UseInterceptors(ParseJWTInterceptor)
  @UseGuards(isTokenGuard, JwtAuthGuard, RoleGuard)
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    vinylDto: VinylsCreateDto,
    @Param('id') id: string
  ): Promise<VinylDocument | void> {
    const vinyl: VinylDocument = await this.vinylService.saveVinyl(vinylDto);
    return vinyl;
  }

  @ApiResponse({ status: 201, description: 'authorized user  create  review' })
  @ApiResponse({
    status: 400,
    description: "if vinyl with this id doesn't exist",
  })
  @ApiResponse({ status: 401, description: 'if invalid jwt credentials' })
  @ApiResponse({ status: 403, description: "if profile role isn't admin" })
  @UseInterceptors(ParseJWTInterceptor)
  @UseGuards(isTokenGuard, JwtAuthGuard)
  @Post(':id/reviews')
  async addReview(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    reviewDto: ReviewCreateDto,
    @Req() req: Request,
    @Param('id') vinylId: string
  ): Promise<IVinylForRequest | undefined> {
    const email: string | undefined = req.headers.authorization;
    if (email) {
      const profile: ProfileDocument | null =
        await this.profileService.getProfileByEmail(email);
      await this.vinylService.addVinylsReview(vinylId, profile?.id, reviewDto);
      const vinyl: IVinylForRequest = await this.vinylService.getVinylById(
        vinylId
      );
      return vinyl;
    }
  }

  @ApiResponse({ status: 201, description: 'authorized user  buy  vinyl' })
  @ApiResponse({
    status: 400,
    description: "if vinyl with this id doesn't exist",
  })
  @ApiResponse({ status: 401, description: 'if invalid jwt credentials' })
  @UseInterceptors(ParseJWTInterceptor)
  @UseGuards(isTokenGuard, JwtAuthGuard)
  @Post(':id/buy-vinyl')
  async byuVinyl(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    paymentDto: PaymentCreateDto,
    @Req() req: Request,
    @Param('id') vinylId: string
  ): Promise<ProfileForRequest | undefined> {
    const email: string | undefined = req.headers.authorization;
    if (email) {
      const profile: ProfileDocument | null =
        await this.profileService.getProfileByEmail(email);
      const vinyl: VinylDocument = await this.vinylService.getVinylById(
        vinylId
      );
      const stripeKey: string | undefined =
        this.configService.get('STRIPE_KEY');
      if (stripeKey) {
        await buyWithStripe(email, paymentDto, stripeKey, +vinyl.price);
      }
      await this.notificationService.sentNotification(
        email,
        'Your payment was provided'
      );
      const updatedProfile: ProfileForRequest =
        await this.profileService.buyVynil(profile?.id, {
          id: vinylId,
          name: vinyl.name,
        });
      return updatedProfile;
    }
  }
}
