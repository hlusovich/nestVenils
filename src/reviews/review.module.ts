import {Module} from '@nestjs/common';
import {ReviewService} from "./review.service";
import {MongooseModule} from '@nestjs/mongoose';
import {ReviewRepository} from "./review.repostitory";
import {BoughtedVinyls, BoughtedVinylsSchema} from "../schemas/boughtedVinyls.schema";
import {Review, ReviewSchema} from "../schemas/review.schema";


@Module({
    imports: [MongooseModule.forFeature([{name: Review.name, schema: ReviewSchema}])],
    providers: [ReviewService, ReviewRepository],
    exports: [ReviewService]
})
export class ReviewModule {
}
