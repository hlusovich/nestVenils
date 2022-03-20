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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const loginCreateDto_1 = require("./dto/loginCreateDto");
const profileCreateDto_1 = require("../Profile/dto/profileCreateDto");
const profile_service_1 = require("../Profile/profile.service");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService, profileService) {
        this.authService = authService;
        this.profileService = profileService;
    }
    async login(loginDto) {
        const user = await this.profileService.getProfileByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException("This user doesn't exist");
        }
        const token = await this.authService.login(user);
        return token;
    }
    async register(avatar, profileDto) {
        const profile = await this.authService.register(profileDto, avatar === null || avatar === void 0 ? void 0 : avatar.buffer);
        return profile;
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'login' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'if profile has already been exsisted',
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginCreateDto_1.LoginCreateDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'create new user' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, common_1.Post)('registration'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profileCreateDto_1.ProfileCreateDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('api/auth/'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        profile_service_1.ProfileService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map