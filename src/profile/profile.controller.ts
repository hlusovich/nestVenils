import {ProfileService} from './profile.service';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param, Patch,
    Req,
    UploadedFile, UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import {ProfileForRequest} from './Profile.interface';
import {ProfileUpdateDto} from './dto/profileUpdateDto';
import {Request} from 'express-serve-static-core';
import {FileInterceptor} from '@nestjs/platform-express';
import {Express} from 'express';
import {ParseJWTInterceptor} from "../interceptors/parseJWT.interceptor";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {isTokenGuard} from "../guards/isTokenGuard";

@Controller('api/profiles/')
export class ProfileController {
    constructor(private profileService: ProfileService) {
    }

    @Get()
    async getAll(): Promise<ProfileForRequest[]> {
        const users: ProfileForRequest[] =
            await this.profileService.getAllProfiles();
        return users;
    }

    @UseInterceptors(ParseJWTInterceptor)
    @UseGuards(isTokenGuard, JwtAuthGuard)
    @Get(':id')
    async getOne(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<ProfileForRequest> {
        const email: string | undefined = req.headers.authorization;
        const profile: ProfileForRequest = await this.profileService.getProfileById(
            id
        );
        if (profile.email !== email) {
            throw new BadRequestException('Invalid Token');
        }
        return profile;
    }

    @UseInterceptors(ParseJWTInterceptor)
    @UseGuards(isTokenGuard, JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Patch(':id')
    async update(
        @UploadedFile() avatar: Express.Multer.File,
        @Body(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            })
        )
            profileDto: ProfileUpdateDto,
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<ProfileForRequest | void> {
        const email: string | undefined = req.headers.authorization;
        const profile: ProfileForRequest = await this.profileService.getProfileById(
            id
        );
        if (profile.email !== email) {
            throw new BadRequestException('Invalid Token');
        }
        if (email) {
            const updatedUser: ProfileForRequest | void =
                await this.profileService.updateProfile(
                    id,
                    profileDto,
                    email,
                    avatar?.buffer
                );
            return updatedUser;
        }
    }
}
