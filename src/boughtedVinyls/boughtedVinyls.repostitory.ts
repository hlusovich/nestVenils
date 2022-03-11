import {Injectable} from "@nestjs/common";
import {Model} from 'mongoose';
import {InjectModel} from "@nestjs/mongoose";
import {v4} from "uuid";
import {BoughtedVinylsDocument} from "../schemas/boughtedVinyls.schema";
import {BoughtedVinyls} from "../schemas/boughtedVinyls.schema";
import {IBoughtedVinyl} from "./boughtedVinyl.interfaces";

@Injectable()
export class BoughtedVinylsRepository {

    constructor(@InjectModel(BoughtedVinyls.name) private boughtedVinylsModel: Model<BoughtedVinylsDocument>) {
    }

    async getAllBoughtedVinyls(userId): Promise<BoughtedVinylsDocument[]> {
        const boughtedVinyls: BoughtedVinylsDocument[] = await this.boughtedVinylsModel.find({userId});
        return boughtedVinyls;
    }

    async saveBoughtedVinyl(data: IBoughtedVinyl): Promise<BoughtedVinylsDocument> {
        const id: string = v4();
        const boughtedVinyl: BoughtedVinylsDocument = new this.boughtedVinylsModel({id, ...data});
        await boughtedVinyl.save();
        return boughtedVinyl;

    };

}

