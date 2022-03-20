import { INotificationService } from './notification.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare class NotificationService implements INotificationService {
    mailerService: MailerService;
    configService: ConfigService;
    constructor(mailerService: MailerService, configService: ConfigService);
    sentNotification(email: string, text: string): Promise<void>;
}
