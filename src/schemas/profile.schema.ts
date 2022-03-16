import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IReview } from '../reviews/review.interfaces';
import { Role } from '../models/role.enum';
import { IBoughtedVinyl } from '../boughtedVinyls/boughtedVinyl.interfaces';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ unique: true })
  id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  birthDate: string;

  @Prop({ default: undefined })
  avatar?: string;

  @Prop({ default: [] })
  boughtedVinyls: IBoughtedVinyl[];

  @Prop({ default: [] })
  reviews: IReview[];

  @Prop({ default: 'user' })
  role: Role;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
