import {VinylsService} from "./vinyls.service";
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post, Query, Req,
    UseGuards, UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {VinylDocument} from "../schemas/vinyls.schema";
import {VinylsCreateDto} from "./dto/vinylsCreateDto";
import {ProfileCreateDto} from "../profile/dto/profileCreateDto";
import {Request} from "express-serve-static-core";
import {ReviewService} from "../reviews/review.service";
import {ReviewCreateDto} from "../reviews/dto/reviewCreateDto";
import {ProfileService} from "../profile/profile.service";
import {ProfileDocument} from "../schemas/profile.schema";
import {ParseJWTInterceptor} from "../interceptors/parseJWT.interceptor";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {IVinylForRequest} from "./vinyls.interface";


@Controller('api/vinyls/')
export class VinylsController {
    constructor(private vinylService: VinylsService, private reviewService: ReviewService, private profileService: ProfileService) {
    }

    @Get()
    async getAll(@Query('price') price: boolean,
                 @Query('author') author: string,
                 @Query('name') name: string): Promise<IVinylForRequest[]> {
        let vinyls: IVinylForRequest[] = await this.vinylService.getAllVinyls();
        if (price) {
            vinyls = vinyls.sort((a, b) => +a.price - +b.price)
        }
        if (author) {
            vinyls = vinyls.filter(vinyl => vinyl.author.includes(author));
        }
        if (name) {
            vinyls = vinyls.filter(vinyl => vinyl.name.includes(name));
        }
        return vinyls;
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IVinylForRequest> {
        const vinyl: IVinylForRequest | void = await this.vinylService.getVinylById(id);
        return vinyl;
    }

    // @UseInterceptors(ParseJWTInterceptor)
    // @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})) vinylDto: VinylsCreateDto,
                 @Param('id') id: string): Promise<VinylDocument | void> {
        const vinyl: VinylDocument = await this.vinylService.saveVinyl(vinylDto);
        return vinyl;
    }


    @UseInterceptors(ParseJWTInterceptor)
    @UseGuards(JwtAuthGuard)
    @Post(":id/reviews")
    async addReview(@Body(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    })) reviewDto: ReviewCreateDto, @Req() req: Request, @Param('id') vinylId: string): Promise<IVinylForRequest> {
        const email: string = req.headers.authorization;
        const profile: ProfileDocument | undefined = await this.profileService.getProfileByEmail(email);
        if (!profile) {
            throw new BadRequestException("This user doesn't exist")
        }
        await this.reviewService.saveReview({...reviewDto, vinylId, userId: profile.id});
        const vinyl: IVinylForRequest = await this.vinylService.getVinylById(vinylId);
        return vinyl;
    }
}
