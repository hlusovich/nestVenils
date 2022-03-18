import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './mailerConfig';
import { MongoDBModule } from './mongoose/mongoose.module';
import { AuthModule } from './authointefication/auth.module';
import { ProfileModule } from './profile/profile.module';
import { VinylsModule } from './vinyls/vinyls.module';
import { GoogleStrategy } from './google/google.strategy';
import { GoogleModule } from './google/google.module';

export const config = (): {
  port: string | undefined;
  jwtSecret: string | undefined;
} => {
  return {
    port: process.env.PORT,
    jwtSecret: process.env.SECRET_KEY,
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MailerModule.forRootAsync(mailerConfig),
    MongoDBModule,
    AuthModule,
    ProfileModule,
    VinylsModule,
    GoogleModule,
  ],
  controllers: [],
  providers: [GoogleStrategy],
})
export class AppModule {}
