import {Injectable} from "@nestjs/common";
import {Model} from 'mongoose';
import {InjectModel} from "@nestjs/mongoose";
import {v4} from "uuid";
import {Review, ReviewDocument} from "../schemas/review.schema";
import {IReview} from "./review.interfaces";

@Injectable()
export class ReviewRepository {

    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {
    }

    async getAllUserReviews(userId): Promise<ReviewDocument[]> {
        const reviews: ReviewDocument[] = await this.reviewModel.find({userId});
        return reviews;
    }

    async getAllVinylReviews(vinylId): Promise<ReviewDocument[]> {
        const reviews: ReviewDocument[] = await this.reviewModel.find({vinylId});
        return reviews;
    }
    async saveReview(data: IReview): Promise<ReviewDocument> {
        const id: string = v4();
        const review: ReviewDocument = new this.reviewModel({id, ...data});
        await review.save();
        return review;

    };

}

