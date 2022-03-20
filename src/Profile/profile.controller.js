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
exports.ProfileController = void 0;
const profile_service_1 = require("./profile.service");
const common_1 = require("@nestjs/common");
const profileUpdateDto_1 = require("./dto/profileUpdateDto");
const platform_express_1 = require("@nestjs/platform-express");
const parseJWT_interceptor_1 = require("../interceptors/parseJWT.interceptor");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const isTokenGuard_1 = require("../guards/isTokenGuard");
const swagger_1 = require("@nestjs/swagger");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getAll() {
        const users = await this.profileService.getAllProfiles();
        return users;
    }
    async getOne(id, req) {
        const email = req.headers.authorization;
        const profile = await this.profileService.getProfileById(id);
        if (profile.email !== email) {
            throw new common_1.BadRequestException('Invalid Token');
        }
        return profile;
    }
    async update(avatar, profileDto, id, req) {
        const email = req.headers.authorization;
        const profile = await this.profileService.getProfileById(id);
        if (profile.email !== email) {
            throw new common_1.BadRequestException('Invalid Token');
        }
        if (email) {
            const updatedUser = await this.profileService.updateProfile(id, profileDto, email, avatar === null || avatar === void 0 ? void 0 : avatar.buffer);
            return updatedUser;
        }
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'get all users' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getAll", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'authorized user get all information about him',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "if profile with this id doesn't exist",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'if invalid jwt credentials' }),
    (0, common_1.UseInterceptors)(parseJWT_interceptor_1.ParseJWTInterceptor),
    (0, common_1.UseGuards)(isTokenGuard_1.isTokenGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getOne", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'authorized user update his profile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "if profile with this id doesn't exist",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'if invalid jwt credentials' }),
    (0, common_1.UseInterceptors)(parseJWT_interceptor_1.ParseJWTInterceptor),
    (0, common_1.UseGuards)(isTokenGuard_1.isTokenGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profileUpdateDto_1.ProfileUpdateDto, String, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "update", null);
ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profiles'),
    (0, common_1.Controller)('api/profiles/'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map