"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailerConfig = void 0;
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const config_1 = require("@nestjs/config");
exports.mailerConfig = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (configService) => {
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
                adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        };
    },
};
//# sourceMappingURL=mailerConfig.js.map