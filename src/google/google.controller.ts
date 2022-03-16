import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Token } from '../authointefication/auth.interface';
import { AuthService } from '../authointefication/auth.service';
import {
  IProfileCreateDtoWithSSO,
  IRequestUserWithSSO,
} from '../profile/Profile.interface';
@Controller()
export class GoogleController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

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
