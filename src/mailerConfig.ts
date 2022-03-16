import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const mailerConfig: MailerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      transport: {
        host: configService.get('SMTP_HOST'),
        port: configService.get('MAIL_PORT'),
        secure: false,
        service: 'Gmail',
        auth: {
          user: configService.get('MAILDEV_INCOMING_USER'),
          pass: configService.get('MAILDEV_INCOMING_PASS'),
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@bigklu95@gmail.com>',
      },
      preview: true,
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  },
};
