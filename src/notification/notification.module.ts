import {Module} from '@nestjs/common';
import {NotificationService} from "./notification.service";
import {NotificationRepository} from "./notification.repository";
import {NotificationSchema,Notification} from "../schemas/notification.schema";
import {MongooseModule} from "@nestjs/mongoose";



@Module({
    imports: [ MongooseModule.forFeature([{name: Notification.name, schema: NotificationSchema},])],
    providers: [NotificationService, NotificationRepository],
    exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {
}
