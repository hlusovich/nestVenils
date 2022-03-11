import {MailerService} from "@nestjs-modules/mailer";

import {NotificationDocument} from "../schemas/notification.schema";


export interface NotificationCreateDto {
    userId: string;
    enableForUpdatePost: boolean;
    enableForUpdateProfile: boolean;

}

export interface INotificationConfigurationModel extends NotificationCreateDto {
    id: string;
}

export interface INotificationRepository {

    subscribe(userId: string): void;

    unsubscribe(userId: string): void;

    getSubscriptionConfiguration(userId: string): Promise< undefined | NotificationDocument>;
}

export interface INotificationService {
    notificationRepository: INotificationRepository;
    mailerService: MailerService;

    getSubscriptionConfiguration(userId: string): Promise<INotificationConfigurationModel | undefined>

    subscribe(userId: string): Promise<void>;

    unsubscribe(userId: string): void;

    sentNotification(email: string, text: string): void;

}
