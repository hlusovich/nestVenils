import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from '@nestjs/passport';
import {ProfileService} from "../profile/profile.service";
import {ProfileDocument} from "../schemas/profile.schema";

@Controller()
export class GoogleController {
    constructor(private jwtService: JwtService, private profileService:ProfileService) {
    }

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('auth/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        const profile:ProfileDocument = await this.profileService.getProfileByEmail(req.user.email);
        if(profile){
            return this.jwtService.sign({email: req.user.email})
        }

    }
}
