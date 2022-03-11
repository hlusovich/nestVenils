import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';


export type ReviewDocument = Review & Document;

@Schema()
export class Review {
    @Prop({unique: true})
    id: string;

    @Prop()
    comment: string;

    @Prop()
    vinylScore: number;

    @Prop()
    userId: string;

    @Prop()
    vinylId: string;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);
