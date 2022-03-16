import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtModuleConfigAsync } from './jwtAsyncConfig';
import { ProfileModule } from '../Profile/profile.module';
import { RoleGuard } from '../guards/RoleGuard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(JwtModuleConfigAsync),
    ProfileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
