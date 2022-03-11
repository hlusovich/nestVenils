import {Module} from '@nestjs/common';
import {VinylsController} from "./vinyls.controller";
import {VinylsService} from "./vinyls.service";
import {NotificationModule} from "../Notification/notification.module";
import { MongooseModule } from '@nestjs/mongoose';
import {VinylSchema, Vinyl} from "../schemas/vinyls.schema";
import {VinylsRepository} from "./vinyls.repostitory";
import {ProfileModule} from "../profile/profile.module";
import {ReviewModule} from "../reviews/review.module";


@Module({
    imports: [NotificationModule,
        MongooseModule.forFeature([{ name: Vinyl.name, schema: VinylSchema }]), ProfileModule, ReviewModule],
    providers: [VinylsService, VinylsRepository],
    controllers: [VinylsController],
    exports:[VinylsService]
})
export class VinylsModule {
}
