import {Module} from '@nestjs/common';
import {StripeModule, StripeAsyncOptions, StripeOptions} from 'nestjs-stripe';
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        StripeModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService): StripeOptions => {
                return {
                    apiKey: configService.get('STRIPE_KEY') || "no",
                    apiVersion: '2020-08-27',
                }
            },
        }),
    ],
})
export class StripePaymentModule {
}
