import {Injectable} from '@nestjs/common';
import {BoughtedVinylsRepository} from "./boughtedVinyls.repostitory";
import {IBoughtedVinyl} from "./boughtedVinyl.interfaces";
import {BoughtedVinylsDocument} from "../schemas/boughtedVinyls.schema";

@Injectable()
export class BoughtedVinylsService {
    constructor(public boughtedVinylsRepository: BoughtedVinylsRepository) {
    }

    async saveBoughtedVinyl(userData: IBoughtedVinyl): Promise<BoughtedVinylsDocument> {
        const vinyl: BoughtedVinylsDocument = await this.boughtedVinylsRepository.saveBoughtedVinyl(userData);
        return vinyl;
    }

    async getAllProfileVinyls(userId:string): Promise<BoughtedVinylsDocument[]> {
        const vinyls: BoughtedVinylsDocument[] = await this.boughtedVinylsRepository.getAllBoughtedVinyls(userId);
        return vinyls;
    }

}
