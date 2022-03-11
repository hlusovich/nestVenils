import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type VinylDocument = Vinyl & Document;

@Schema()
export class Vinyl {
    @Prop({unique: true})
    id: string;

    @Prop()
    price: string;

    @Prop()
    name: string;

    @Prop()
    author: string;

    @Prop()
    description: string;

    @Prop()
    image: string;
}

export const VinylSchema = SchemaFactory.createForClass(Vinyl);
