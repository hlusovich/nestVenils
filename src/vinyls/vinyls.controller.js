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
exports.VinylsController = void 0;
const vinyls_service_1 = require("./vinyls.service");
const common_1 = require("@nestjs/common");
const vinylsCreateDto_1 = require("./dto/vinylsCreateDto");
const reviewCreateDto_1 = require("../reviews/dto/reviewCreateDto");
const profile_service_1 = require("../Profile/profile.service");
const parseJWT_interceptor_1 = require("../interceptors/parseJWT.interceptor");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const isTokenGuard_1 = require("../guards/isTokenGuard");
const role_decorator_1 = require("../decorators/role.decorator");
const role_enum_1 = require("../models/role.enum");
const RoleGuard_1 = require("../guards/RoleGuard");
const config_1 = require("@nestjs/config");
const paymentCreateDto_1 = require("./dto/paymentCreateDto");
const notification_service_1 = require("../notification/notification.service");
const buyWithStripe_1 = require("../../utils/buyWithStripe");
const swagger_1 = require("@nestjs/swagger");
let VinylsController = class VinylsController {
    constructor(vinylService, profileService, configService, notificationService) {
        this.vinylService = vinylService;
        this.profileService = profileService;
        this.configService = configService;
        this.notificationService = notificationService;
    }
    async getAll(price, author, name) {
        let vinyls = await this.vinylService.getAllVinyls();
        if (price) {
            vinyls = vinyls.sort((a, b) => +a.price - +b.price);
        }
        if (author) {
            vinyls = vinyls.filter((vinyl) => vinyl.author.includes(author));
        }
        if (name) {
            vinyls = vinyls.filter((vinyl) => vinyl.name.includes(name));
        }
        return vinyls;
    }
    async getOne(id) {
        const vinyl = await this.vinylService.getVinylById(id);
        return vinyl;
    }
    async create(vinylDto, id) {
        const vinyl = await this.vinylService.saveVinyl(vinylDto);
        return vinyl;
    }
    async addReview(reviewDto, req, vinylId) {
        const email = req.headers.authorization;
        if (email) {
            const profile = await this.profileService.getProfileByEmail(email);
            await this.vinylService.addVinylsReview(vinylId, profile === null || profile === void 0 ? void 0 : profile.id, reviewDto);
            const vinyl = await this.vinylService.getVinylById(vinylId);
            return vinyl;
        }
    }
    async byuVinyl(paymentDto, req, vinylId) {
        const email = req.headers.authorization;
        if (email) {
            const profile = await this.profileService.getProfileByEmail(email);
            const vinyl = await this.vinylService.getVinylById(vinylId);
            const stripeKey = this.configService.get('STRIPE_KEY');
            if (stripeKey) {
                await (0, buyWithStripe_1.buyWithStripe)(email, paymentDto, stripeKey, +vinyl.price);
            }
            await this.notificationService.sentNotification(email, 'Your payment was provided');
            const updatedProfile = await this.profileService.buyVynil(profile === null || profile === void 0 ? void 0 : profile.id, {
                id: vinylId,
                name: vinyl.name,
            });
            return updatedProfile;
        }
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'get all vinyls which can be ' +
            'sorted by price and filtered by author and name',
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('price')),
    __param(1, (0, common_1.Query)('author')),
    __param(2, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String, String]),
    __metadata("design:returntype", Promise)
], VinylsController.prototype, "getAll", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'get  vinyl by id' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "if vinyl with this id doesn't exist",
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VinylsController.prototype, "getOne", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin  create  new vinyl' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'if invalid jwt credentials' }),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.UseInterceptors)(parseJWT_interceptor_1.ParseJWTInterceptor),
    (0, common_1.UseGuards)(isTokenGuard_1.isTokenGuard, jwt_auth_guard_1.JwtAuthGuard, RoleGuard_1.RoleGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vinylsCreateDto_1.VinylsCreateDto, String]),
    __metadata("design:returntype", Promise)
], VinylsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'authorized user  create  review' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "if vinyl with this id doesn't exist",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'if invalid jwt credentials' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "if profile role isn't admin" }),
    (0, common_1.UseInterceptors)(parseJWT_interceptor_1.ParseJWTInterceptor),
    (0, common_1.UseGuards)(isTokenGuard_1.isTokenGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/reviews'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviewCreateDto_1.ReviewCreateDto, Object, String]),
    __metadata("design:returntype", Promise)
], VinylsController.prototype, "addReview", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'authorized user  buy  vinyl' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "if vinyl with this id doesn't exist",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'if invalid jwt credentials' }),
    (0, common_1.UseInterceptors)(parseJWT_interceptor_1.ParseJWTInterceptor),
    (0, common_1.UseGuards)(isTokenGuard_1.isTokenGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/buy-vinyl'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paymentCreateDto_1.PaymentCreateDto, Object, String]),
    __metadata("design:returntype", Promise)
], VinylsController.prototype, "byuVinyl", null);
VinylsController = __decorate([
    (0, swagger_1.ApiTags)('Vinyls'),
    (0, common_1.Controller)('api/vinyls/'),
    __metadata("design:paramtypes", [vinyls_service_1.VinylsService,
        profile_service_1.ProfileService,
        config_1.ConfigService,
        notification_service_1.NotificationService])
], VinylsController);
exports.VinylsController = VinylsController;
//# sourceMappingURL=vinyls.controller.js.map
