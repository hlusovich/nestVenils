import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCreateDto } from './dto/loginCreateDto';
import { ProfileCreateDto } from '../Profile/dto/profileCreateDto';
import { ProfileForRequest } from '../Profile/Profile.interface';
import { ProfileService } from '../Profile/profile.service';
import { ProfileDocument } from '../schemas/profile.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Token } from './auth.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  @ApiResponse({ status: 201, description: 'login' })
  @ApiResponse({
    status: 400,
    description: 'if profile has already been exsisted',
  })
  @Post('login')
  async login(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    loginDto: LoginCreateDto
  ): Promise<Token> {
    const user: ProfileDocument | null =
      await this.profileService.getProfileByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("This user doesn't exist");
    }
    const token: Token = await this.authService.login(user);
    return token;
  }

  @ApiResponse({ status: 201, description: 'create new user' })
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('registration')
  async register(
    @UploadedFile() avatar: Express.Multer.File,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    profileDto: ProfileCreateDto
  ): Promise<ProfileForRequest> {
    const profile: ProfileForRequest = await this.authService.register(
      profileDto,
      avatar?.buffer
    );
    return profile;
  }
}
