import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from '../Profile/profile.module';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtModuleConfigAsync } from '../authointefication/jwtAsyncConfig';
import { AuthModule } from '../authointefication/auth.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync(JwtModuleConfigAsync),
    NotificationModule,
  ],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
})
export class GoogleModule {}
