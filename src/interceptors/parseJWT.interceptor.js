"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseJWTInterceptor = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var jsonwebtoken = require("jsonwebtoken");
var ParseJWTInterceptor = (function () {
    function ParseJWTInterceptor(configService) {
        this.configService = configService;
    }
    ParseJWTInterceptor.prototype.intercept = function (context, next) {
        var req = context.switchToHttp().getRequest();
        var authToken = req.headers.authorization;
        if (authToken) {
            var splitedAuthorization = authToken.split(' ')[1];
            var secret = this.configService.get('SECRET_KEY');
            if (secret) {
                try {
                    var decoded = jsonwebtoken.verify(splitedAuthorization, secret);
                    if (typeof decoded !== 'string') {
                        req.headers.authorization = decoded.email;
                    }
                }
                catch (e) {
                    throw new common_1.BadRequestException('Token is invalid');
                }
            }
        }
        return next.handle();
    };
    ParseJWTInterceptor = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [config_1.ConfigService])
    ], ParseJWTInterceptor);
    return ParseJWTInterceptor;
}());
exports.ParseJWTInterceptor = ParseJWTInterceptor;
