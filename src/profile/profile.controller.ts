import {ProfileService} from "./profile.service";
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch, Post, Req, UploadedFile,
    UseGuards, UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {ProfileForRequest} from "./Profile.interface";
import {ProfileUpdateDto} from "./dto/profileUpdateDto";
import {NotificationService} from "../Notification/notification.service";
import {INotificationConfigurationModel} from "../Notification/notification.interface";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {Request} from "express-serve-static-core";
import {ParseJWTInterceptor} from "../interceptors/parseJWT.interceptor";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express} from "express";
import {ProfileCreateDto} from "./dto/profileCreateDto";


@Controller('api/profiles/')
export class ProfileController {
    constructor(private profileService: ProfileService, private notificationService: NotificationService) {
    }

    @Get()
    async getAll(): Promise<ProfileForRequest[]> {
        const users: ProfileForRequest[] = await this.profileService.getAllProfiles();
        return users;
    }

    // @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string): Promise<ProfileForRequest> {
        const user: ProfileForRequest = await this.profileService.getProfileById(id);
        return user;
    }

    // @UseInterceptors(ParseJWTInterceptor)
    // @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Patch(":id")
    async update(@UploadedFile() avatar: Express.Multer.File, @Body(new ValidationPipe({
                     whitelist: true,
                     forbidNonWhitelisted: true
                 })) profileDto: ProfileUpdateDto,
                 @Param('id') id: string, @Req() req: Request): Promise<ProfileForRequest | void> {
        const email: string = req.headers.authorization;
        const updatedUser: ProfileForRequest | void = await this.profileService.updateProfile(id, profileDto, email, avatar.buffer);
        if (updatedUser) {
            const notificationConfiguration: INotificationConfigurationModel | undefined = await this.notificationService.getSubscriptionConfiguration(updatedUser.email);
            if (notificationConfiguration && notificationConfiguration.enableForUpdatePost) {
                this.notificationService.sentNotification(updatedUser.email);
            }
        }
        return updatedUser;
    }

}
