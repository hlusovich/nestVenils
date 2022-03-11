import {Module} from '@nestjs/common';
import {BoughtedVinylsService} from "./boughtedVinyls.service";
import {MongooseModule} from '@nestjs/mongoose';
import {BoughtedVinylsRepository} from "./boughtedVinyls.repostitory";
import {BoughtedVinyls, BoughtedVinylsSchema} from "../schemas/boughtedVinyls.schema";


@Module({
    imports: [MongooseModule.forFeature([{name: BoughtedVinyls.name, schema: BoughtedVinylsSchema}])],
    providers: [BoughtedVinylsService, BoughtedVinylsRepository],
    exports: [BoughtedVinylsService]
})
export class BoughtedVinylsModule {
}
