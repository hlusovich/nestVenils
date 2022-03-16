import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {v4} from 'uuid';
import {VinylDocument, Vinyl} from '../schemas/vinyls.schema';
import {IVinylCreateDto} from './vinyls.interface';
import {IReview} from '../reviews/review.interfaces';

@Injectable()
export class VinylsRepository {
    constructor(
        @InjectModel(Vinyl.name) private vinylsModel: Model<VinylDocument>
    ) {
    }

    async getAllVinyls(): Promise<VinylDocument[]> {
        const vinyls: VinylDocument[] = await this.vinylsModel.find();
        return vinyls;
    }

    async saveVinyl(vinylData: IVinylCreateDto): Promise<VinylDocument> {
        const id: string = v4();
        const vinyl: VinylDocument = new this.vinylsModel({id, ...vinylData});
        await vinyl.save();
        return vinyl;
    }

    async getVinylById(id: string): Promise<VinylDocument | null> {
        const vinyl: VinylDocument| null = await this.vinylsModel.findOne({id});
        return vinyl;
    }

    async addVinylsReview(id: string, review: IReview): Promise<void> {
        const vinyl: VinylDocument | null = await this.getVinylById(id);
        if (vinyl) {
            const reviews: IReview[] = vinyl.reviews;
            reviews.push(review);
            await this.vinylsModel.updateOne({id}, {reviews});
        }
    }
}
