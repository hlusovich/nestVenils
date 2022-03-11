import {
    NotificationCreateDto,
    INotificationService,
    INotificationConfigurationModel,
} from "./notification.interface";
import {BadRequestException, ForbiddenException, Injectable} from "@nestjs/common";
import {NotificationRepository} from "./notification.repository";
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class NotificationService implements INotificationService {
    constructor(public notificationRepository: NotificationRepository, public mailerService: MailerService, public  configService:ConfigService) {
    }

   async getSubscriptionConfiguration(userId: string): Promise<INotificationConfigurationModel | undefined> {
        return await this.notificationRepository.getSubscriptionConfiguration(userId);
    }

   async unsubscribe(userId: string): Promise<void> {
        const subscription: INotificationConfigurationModel | undefined = await this.notificationRepository.getSubscriptionConfiguration(userId);
        if (subscription) {
            this.notificationRepository.unsubscribe(userId);
        } else {
            throw  new ForbiddenException("You are already unsubscribed");
        }
    }

   async subscribe(userId: string): Promise<void> {
        const subscription: INotificationConfigurationModel | undefined = await this.notificationRepository.getSubscriptionConfiguration(userId);
        if (!subscription) {
           await this.notificationRepository.subscribe(userId);
        } else {
            throw  new BadRequestException("You are already subscribed");
        }

    }

   async sentNotification(email: string): Promise<void> {
        this.mailerService
            .sendMail({
                to: email,
                from: this.configService.get("URL"),
                subject: 'Testing Nest MailerModule ✔',
                text: 'Updated',
                html: '<b>Updated</b>',
            })
            .then(() => {
                console.log("notification was sent successfully")
            })
            .catch(() => {
            });

    }


}
