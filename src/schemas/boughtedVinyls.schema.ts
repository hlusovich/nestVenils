import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {v4} from 'uuid'

export type BoughtedVinylsDocument = BoughtedVinyls & Document;

@Schema()
export class BoughtedVinyls {
    @Prop({unique: true})
    id: string;

    @Prop()
    userId: string;

    @Prop()
    name: string;

}

export const BoughtedVinylsSchema = SchemaFactory.createForClass(BoughtedVinyls);
