import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IReview } from '../reviews/review.interfaces';

export type VinylDocument = Vinyl & Document;

@Schema()
export class Vinyl {
  @Prop({ unique: true })
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

  @Prop({ default: [] })
  reviews: IReview[];
}

export const VinylSchema = SchemaFactory.createForClass(Vinyl);
