import {Module} from '@nestjs/common';
import {ProfileController} from "./profile.controller";
import {ProfileService} from "./profile.service";
import {ProfileRepository} from "./profile.repostitory";
import {NotificationModule} from "../Notification/notification.module";
import {MongooseModule} from '@nestjs/mongoose';
import {ProfileSchema, Profile} from "../schemas/profile.schema";
import {ConfigModule} from "@nestjs/config";
import {BoughtedVinylsModule} from "../boughtedVinyls/boughtedVinyls.module";
import {ReviewModule} from "../reviews/review.module";


@Module({
    imports: [NotificationModule, BoughtedVinylsModule, ReviewModule,
        MongooseModule.forFeature([{name: Profile.name, schema: ProfileSchema},
        ]), ConfigModule],
    providers: [ProfileService, ProfileRepository],
    controllers: [ProfileController],
    exports: [ProfileService]
})
export class ProfileModule {
}
