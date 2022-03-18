import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtModuleConfigAsync } from '../authointefication/jwtAsyncConfig';
import { AuthModule } from '../authointefication/auth.module';

@Module({
  imports: [AuthModule, JwtModule.registerAsync(JwtModuleConfigAsync)],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
})
export class GoogleModule {}
