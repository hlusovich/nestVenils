import { VinylsService } from './vinyls.service';
import { VinylDocument } from '../schemas/vinyls.schema';
import { VinylsCreateDto } from './dto/vinylsCreateDto';
import { Request } from 'express-serve-static-core';
import { ReviewCreateDto } from '../reviews/dto/reviewCreateDto';
import { ProfileService } from '../Profile/profile.service';
import { IVinylForRequest } from './vinyls.interface';
import { ProfileForRequest } from '../Profile/Profile.interface';
import { ConfigService } from '@nestjs/config';
import { PaymentCreateDto } from './dto/paymentCreateDto';
import { NotificationService } from '../notification/notification.service';
export declare class VinylsController {
    private vinylService;
    private profileService;
    private configService;
    private notificationService;
    constructor(vinylService: VinylsService, profileService: ProfileService, configService: ConfigService, notificationService: NotificationService);
    getAll(price: boolean, author: string, name: string): Promise<IVinylForRequest[]>;
    getOne(id: string): Promise<IVinylForRequest>;
    create(vinylDto: VinylsCreateDto, id: string): Promise<VinylDocument | void>;
    addReview(reviewDto: ReviewCreateDto, req: Request, vinylId: string): Promise<IVinylForRequest | undefined>;
    byuVinyl(paymentDto: PaymentCreateDto, req: Request, vinylId: string): Promise<ProfileForRequest | undefined>;
}
