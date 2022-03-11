import {
    INotificationRepository
} from "./notification.interface";
import {Injectable} from "@nestjs/common";
import {Model} from 'mongoose';
import {ConfigService} from "@nestjs/config";
import {InjectModel} from "@nestjs/mongoose";
import {NotificationDocument, Notification} from "../schemas/notification.schema";
import {v4} from "uuid";

@Injectable()
export class NotificationRepository implements INotificationRepository {

    constructor(
        private configService: ConfigService,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,) {
    }

    async subscribe(userId: string): Promise<void> {
        const id: string = v4();
        const notificationConfiguration: NotificationDocument = new this.notificationModel({id, userId});
        await notificationConfiguration.save();
    }

    async getSubscriptionConfiguration(userId: string): Promise<undefined | NotificationDocument> {
        const notificationConfiguration: NotificationDocument = await this.notificationModel.findOne({userId});
        return notificationConfiguration;
    }

    async unsubscribe(userId: string): Promise<void> {
        await this.notificationModel.deleteOne({userId});
    }
}

