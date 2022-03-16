import {VinylsService} from './vinyls.service';
import {
    BadRequestException,
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
import {VinylDocument} from '../schemas/vinyls.schema';
import {VinylsCreateDto} from './dto/vinylsCreateDto';
import {Request} from 'express-serve-static-core';
import {ReviewCreateDto} from '../reviews/dto/reviewCreateDto';
import {ProfileService} from '../profile/profile.service';
import {ProfileDocument} from '../schemas/profile.schema';
import {ParseJWTInterceptor} from '../interceptors/parseJWT.interceptor';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {IVinylForRequest} from './vinyls.interface';
import {isTokenGuard} from '../guards/isTokenGuard';
import Stripe from 'stripe';
import {ProfileForRequest} from '../profile/Profile.interface';
import {Roles} from "../decorators/role.decorator";
import {Role} from "../models/role.enum";
import {RoleGuard} from "../guards/RoleGuard";
import {ConfigService} from "@nestjs/config";
import {PaymentCreateDto} from "./dto/paymentCreateDto";
import {NotificationService} from "../notification/notification.service";


@Controller('api/vinyls/')
export class VinylsController {
    constructor(
        private vinylService: VinylsService,
        private profileService: ProfileService,
        private configService: ConfigService,
        private notificationService: NotificationService
    ) {
    }

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

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IVinylForRequest> {
        const vinyl: IVinylForRequest | void = await this.vinylService.getVinylById(
            id
        );
        return vinyl;
    }

    @Roles(Role.ADMIN)
    @UseInterceptors(ParseJWTInterceptor)
    @UseGuards(isTokenGuard, JwtAuthGuard, RoleGuard)
    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
            vinylDto: VinylsCreateDto,
        @Param('id') id: string
    ): Promise<VinylDocument | void> {
        const vinyl: VinylDocument = await this.vinylService.saveVinyl(vinylDto);
        return vinyl;
    }

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
            const vinyl: VinylDocument = await this.vinylService.getVinylById(vinylId);
            const stripe = new Stripe(this.configService.get("STRIPE_KEY") || "no", {
                apiVersion: '2020-08-27',
            });
            const customer: Stripe.Customer = await stripe.customers.create({
                email: email,
                payment_method: paymentDto.payment_method,

            });
            try {
                const paymentMethod: Stripe.PaymentMethod = await stripe.paymentMethods.create(
                    {
                        type: 'card',
                        card: {
                            number: paymentDto.number,
                            exp_month: +paymentDto.exp_month,
                            exp_year: +paymentDto.exp_year,
                            cvc: paymentDto.cvc,
                        },
                    }
                );
                const product: Stripe.Product = await stripe.products.create(
                    {name: 'Gold Special'}
                );
                const price = await stripe.prices.create(
                    {
                        unit_amount: +vinyl.price * 100,
                        currency: 'eur',
                        recurring: {interval: 'month'},
                        product: product.id,
                    }
                );
                const attachPaymentToCustomer: Stripe.PaymentMethod = await stripe.paymentMethods.attach(
                    paymentMethod.id,
                    {customer: customer.id}
                );
                const updateCustomerDefaultPaymentMethod: Stripe.Customer = await stripe.customers.update(
                    customer.id, {

                        invoice_settings: {
                            default_payment_method: paymentMethod.id,
                        },
                    });
                const newSubscription = await stripe.subscriptions.create({
                    customer: customer.id,
                    items: [{plan: price.id, quantity: 1}],
                    default_payment_method: paymentMethod.id,
                });

            } catch (e) {
                // @ts-ignore
                throw new BadRequestException(e.message);
            }
            await this.notificationService.sentNotification(email, "Your payment was provided")
            const updatedProfile: ProfileForRequest =
                await this.profileService.buyVynil(profile?.id, {
                    id: vinylId,
                    name: vinyl.name,
                });
            return updatedProfile;
        }
    }
}
