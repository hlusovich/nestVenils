import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {v4} from 'uuid'
import {Buffer} from "buffer";

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {

    @Prop({unique: true})
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

    @Prop({default: undefined})
    avatar?: string
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
