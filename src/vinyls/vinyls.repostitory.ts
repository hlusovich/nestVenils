import {Injectable} from "@nestjs/common";
import {Model} from 'mongoose';
import {InjectModel} from "@nestjs/mongoose";
import {v4} from "uuid";
import {VinylDocument, Vinyl} from "../schemas/vinyls.schema";
import {IVinylCreateDto} from "./vinyls.interface";

@Injectable()
export class VinylsRepository {

    constructor(@InjectModel(Vinyl.name) private vinylsModel: Model<VinylDocument>) {
    }

    async getAllVinyls(): Promise<VinylDocument[]> {
        const vinyls: VinylDocument[] = await this.vinylsModel.find();
        return vinyls;
    }


    async saveVinyl(userData: IVinylCreateDto): Promise<VinylDocument> {
        const id: string = v4();
        const vinyl: VinylDocument = new this.vinylsModel({id, ...userData});
        await vinyl.save();
        return vinyl;

    };

    async getVinylById(id: string): Promise<VinylDocument | undefined> {
        const vinyl: VinylDocument = await this.vinylsModel.findOne({id});
        return vinyl;

    }

}

