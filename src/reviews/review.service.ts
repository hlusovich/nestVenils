import {Injectable} from "@nestjs/common";
import {ReviewRepository} from "./review.repostitory";
import {IReview} from "./review.interfaces";
import {ReviewDocument} from "../schemas/review.schema";


@Injectable()
export class ReviewService {
    constructor(public reviewRepository: ReviewRepository) {
    }

    async saveReview(data: IReview): Promise<ReviewDocument> {
        const vinyl: ReviewDocument = await this.reviewRepository.saveReview(data);
        return vinyl;
    }

    async getAllProfileReviews(userId: string): Promise<ReviewDocument[]> {
        const vinyls: ReviewDocument[] = await this.reviewRepository.getAllUserReviews(userId);
        return vinyls;
    }

    async getAllVinylReviews(vinylId: string): Promise<ReviewDocument[]> {
        const vinyls: ReviewDocument[] = await this.reviewRepository.getAllVinylReviews(vinylId);
        return vinyls;
    }

}
