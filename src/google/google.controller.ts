import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Token } from '../authointefication/auth.interface';
import { AuthService } from '../authointefication/auth.service';
import {
  IProfileCreateDtoWithSSO,
  IRequestUserWithSSO,
} from '../profile/Profile.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Google')
@Controller()
export class GoogleController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  @ApiResponse({ status: 301, description: 'redirect to auth/google/callback' })
  @Get()
  @Redirect('auth/google/callback', 301)
  redirect(): void {
    console.log('redirect to sso page');
  }

  @ApiResponse({ status: 200, description: 'provide sso auth' })
  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: IRequestUserWithSSO): Promise<Token> {
    const profile: IProfileCreateDtoWithSSO = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatar: req.user.picture,
      email: req.user.email,
    };
    const token: Token = await this.authService.registerWithSSO(profile);
    return token;
  }
}
