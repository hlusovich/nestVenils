import { VinylsRepository } from './vinyls.repostitory';
import { IVinylCreateDto } from './vinyls.interface';
import { VinylDocument } from '../schemas/vinyls.schema';
import { ProfileService } from '../Profile/profile.service';
import { IReviewCreateDto } from '../reviews/review.interfaces';
import { ProfileForRequest } from '../Profile/Profile.interface';
export declare class VinylsService {
    private vinylsRepository;
    private profileService;
    constructor(vinylsRepository: VinylsRepository, profileService: ProfileService);
    saveVinyl(data: IVinylCreateDto): Promise<VinylDocument>;
    getAllVinyls(): Promise<VinylDocument[]>;
    getVinylById(id: string): Promise<VinylDocument>;
    addVinylsReview(vinylId: string, userId: string, review: IReviewCreateDto): Promise<VinylDocument>;
    addBoughtVynil(profileId: string, vinylId: string): Promise<ProfileForRequest>;
}
