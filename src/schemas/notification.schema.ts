import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {

    @Prop({unique: true})
    id: string;

    @Prop()
    userId: string;

    @Prop( {default: true})
    enableForUpdatePost: boolean;

    @Prop( {default: true})
    enableForUpdateProfile: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
