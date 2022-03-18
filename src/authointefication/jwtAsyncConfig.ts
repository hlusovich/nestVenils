import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const JwtModuleConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService
  ): Promise<JwtModuleOptions> => {
    return {
      secret: configService.get('SECRET_KEY'),
    };
  },
  inject: [ConfigService],
};
