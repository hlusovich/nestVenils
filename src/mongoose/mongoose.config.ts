import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModuleAsyncOptions} from '@nestjs/mongoose';

export const mongooseAsyncConfig: MongooseModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        return {
            uri: configService.get<string>('MONGO_DB_CONNECTION'),
        }
    },
    inject: [ConfigService],
};
