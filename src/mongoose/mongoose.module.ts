import { Module } from '@nestjs/common';
import { mongooseAsyncConfig } from './mongoose.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRootAsync(mongooseAsyncConfig)],
})
export class MongoDBModule {}
