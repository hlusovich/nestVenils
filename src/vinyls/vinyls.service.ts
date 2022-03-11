import {Injectable} from '@nestjs/common';
import {VinylsRepository} from "./vinyls.repostitory";
import {IVinylCreateDto, IVinylForRequest} from "./vinyls.interface";
import {VinylDocument} from "../schemas/vinyls.schema";
import {ReviewService} from "../reviews/review.service";
import {ReviewDocument} from "../schemas/review.schema";

@Injectable()
export class VinylsService {
    constructor(private vinylsRepository: VinylsRepository, private reviewService: ReviewService) {
    }

    async saveVinyl(data: IVinylCreateDto): Promise<VinylDocument> {
        const vinyl: VinylDocument = await this.vinylsRepository.saveVinyl(data);
        return vinyl;
    }

    async getAllVinyls(): Promise<IVinylForRequest[]> {
        const vinyls: VinylDocument[] = await this.vinylsRepository.getAllVinyls();
        const vinylForRequest = [];
        for (let i = 0; i < vinyls.length; i++) {
            const vinyl: IVinylForRequest = await this.getVinylForRequest(vinyls[i]);
            vinylForRequest.push(vinyl);
        }
        return vinylForRequest;
    }

    async getVinylForRequest(vinyl: VinylDocument): Promise<IVinylForRequest> {
        const reviews: ReviewDocument[] = await this.reviewService.getAllVinylReviews(vinyl.id);
        return {
            price: vinyl.price,
            name: vinyl.name,
            author: vinyl.author,
            description: vinyl.description, reviews
        };

    }

    async getVinylById(id: string): Promise<IVinylForRequest> {
        const vinyl: VinylDocument | undefined = await this.vinylsRepository.getVinylById(id);
        const vinylForRequest: IVinylForRequest = await this.getVinylForRequest(vinyl);
        console.log(vinylForRequest)
        return vinylForRequest;
    }

}
