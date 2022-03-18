import {Module} from '@nestjs/common';
import {ProfileController} from './profile.controller';
import {ProfileService} from './profile.service';
import {ProfileRepository} from './profile.repostitory';
import {MongooseModule} from '@nestjs/mongoose';
import {ProfileSchema, Profile} from '../schemas/profile.schema';
import {ConfigModule} from '@nestjs/config';
import {RoleGuard} from '../guards/RoleGuard';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Profile.name, schema: ProfileSchema}]),
        ConfigModule,
    ],
    providers: [RoleGuard, ProfileService, ProfileRepository],
    controllers: [ProfileController],
    exports: [ProfileService],
})
export class ProfileModule {
}
