"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var mailer_1 = require("@nestjs-modules/mailer");
var mailerConfig_1 = require("./mailerConfig");
var mongoose_module_1 = require("./mongoose/mongoose.module");
var auth_module_1 = require("./authointefication/auth.module");
var profile_module_1 = require("./profile/profile.module");
var vinyls_module_1 = require("./vinyls/vinyls.module");
var google_strategy_1 = require("./google/google.strategy");
var google_module_1 = require("./google/google.module");
var stripe_module_1 = require("./stripe/stripe.module");
var config = function () {
    return {
        port: process.env.PORT,
        jwtSecret: process.env.SECRET_KEY,
    };
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true, load: [config] }),
                mailer_1.MailerModule.forRootAsync(mailerConfig_1.mailerConfig),
                mongoose_module_1.MongoDBModule,
                auth_module_1.AuthModule,
                profile_module_1.ProfileModule,
                vinyls_module_1.VinylsModule,
                google_module_1.GoogleModule,
                stripe_module_1.StripePaymentModule
            ],
            controllers: [],
            providers: [google_strategy_1.GoogleStrategy],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
