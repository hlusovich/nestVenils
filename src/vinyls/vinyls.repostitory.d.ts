import { Model } from 'mongoose';
import { VinylDocument } from '../schemas/vinyls.schema';
import { IVinylCreateDto } from './vinyls.interface';
import { IReview } from '../reviews/review.interfaces';
export declare class VinylsRepository {
    private vinylsModel;
    constructor(vinylsModel: Model<VinylDocument>);
    getAllVinyls(): Promise<VinylDocument[]>;
    saveVinyl(vinylData: IVinylCreateDto): Promise<VinylDocument>;
    getVinylById(id: string): Promise<VinylDocument | null>;
    addVinylsReview(id: string, review: IReview): Promise<void>;
    deleteVinyl(id: string): Promise<void>;
}
