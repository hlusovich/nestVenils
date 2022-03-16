import { Module } from '@nestjs/common';
import { VinylsController } from './vinyls.controller';
import { VinylsService } from './vinyls.service';
import { NotificationModule } from '../Notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VinylSchema, Vinyl } from '../schemas/vinyls.schema';
import { VinylsRepository } from './vinyls.repostitory';
import { ProfileModule } from '../profile/profile.module';
import {NotificationService} from "../notification/notification.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vinyl.name, schema: VinylSchema }]),
    ProfileModule,
  ],
  providers: [VinylsService, VinylsRepository, NotificationService],
  controllers: [VinylsController],
  exports: [VinylsService],
})
export class VinylsModule {}
