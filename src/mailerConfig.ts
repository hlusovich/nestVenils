import {MailerAsyncOptions} from "@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {ConfigModule, ConfigService} from "@nestjs/config";

export const mailerConfig: MailerAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        transport: {
            host: configService.get("HOST"),
            port: configService.get("MAIL_PORT"),
            ignoreTLS: true,
            secure: false,
            auth: {
                user: configService.get("MAILDEV_INCOMING_USER"),
                pass: configService.get("MAILDEV_INCOMING_PASS"),
            },
        },
        defaults: {
            from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
        template: {
            dir: process.cwd() + '/template/',
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    }),
};
