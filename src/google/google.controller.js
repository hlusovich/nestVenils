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
exports.GoogleController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("../authointefication/auth.service");
const swagger_1 = require("@nestjs/swagger");
let GoogleController = class GoogleController {
    constructor(jwtService, authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }
    redirect() {
        console.log('redirect to sso page');
    }
    async googleAuthRedirect(req) {
        const profile = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            avatar: req.user.picture,
            email: req.user.email,
        };
        const token = await this.authService.registerWithSSO(profile);
        return token;
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({ status: 301, description: 'redirect to auth/google/callback' }),
    (0, common_1.Get)(),
    (0, common_1.Redirect)('auth/google/callback', 301),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GoogleController.prototype, "redirect", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'provide sso auth' }),
    (0, common_1.Get)('auth/google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoogleController.prototype, "googleAuthRedirect", null);
GoogleController = __decorate([
    (0, swagger_1.ApiTags)('Google'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_service_1.AuthService])
], GoogleController);
exports.GoogleController = GoogleController;
//# sourceMappingURL=google.controller.js.map