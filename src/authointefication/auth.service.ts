import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginCreateDto } from './dto/loginCreateDto';
import { IAuthService, Token } from './auth.interface';
import { ProfileService } from '../Profile/profile.service';
import { hash } from 'bcrypt';
import { ProfileCreateDto } from '../Profile/dto/profileCreateDto';
import {
  IProfileCreateDtoWithSSO,
  ProfileForRequest,
} from '../Profile/Profile.interface';
import { ProfileDocument } from '../schemas/profile.schema';
import { Buffer } from 'buffer';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    private profileService: ProfileService
  ) {}

  async login(user: ProfileDocument): Promise<Token> {
    const payload = { email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    profileDto: ProfileCreateDto,
    avatar?: Buffer
  ): Promise<ProfileForRequest> {
    const user: ProfileDocument | null =
      await this.profileService.getProfileByEmail(profileDto.email);
    if (user) {
      throw new BadRequestException(
        'ProfileSchema with this email already exists'
      );
    }
    const hashPassword: string = await hash(profileDto.password, 3);
    return this.profileService.saveProfile({
      ...profileDto,
      password: hashPassword,
      avatar,
    });
  }

  async registerWithSSO(profileDto: IProfileCreateDtoWithSSO): Promise<Token> {
    const profile: ProfileDocument | null =
      await this.profileService.getProfileByEmail(profileDto.email);
    if (profile) {
      return {
        access_token: this.jwtService.sign({
          email: profile.email,
          role: profile.role,
        }),
      };
    }
    const profileCreatedWithSSO: ProfileForRequest =
      await this.profileService.saveProfileWithSSO({ ...profileDto });
    return {
      access_token: this.jwtService.sign({
        email: profileCreatedWithSSO.email,
        role: profileCreatedWithSSO.role,
      }),
    };
  }
}
