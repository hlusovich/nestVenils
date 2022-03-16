import { INotificationService } from './notification.interface';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    public mailerService: MailerService,
    public configService: ConfigService
  ) {}

  async sentNotification(email: string, text: string): Promise<void> {
    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('MAILDEV_INCOMING_USER'),
        subject: 'Testing Nest MailerModule ✔',
        text: text,
        html: `<b>${text}</b>`,
      })
      .then(() => {
        console.log('notification was sent successfully');
      })
      .catch((e) => {
        console.log('error', e);
      });
  }
}
