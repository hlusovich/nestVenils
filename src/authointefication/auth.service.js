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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const profile_service_1 = require("../Profile/profile.service");
const bcrypt_1 = require("bcrypt");
let AuthService = class AuthService {
    constructor(jwtService, profileService) {
        this.jwtService = jwtService;
        this.profileService = profileService;
    }
    async login(user) {
        const payload = { email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(profileDto, avatar) {
        const user = await this.profileService.getProfileByEmail(profileDto.email);
        if (user) {
            throw new common_1.BadRequestException('ProfileSchema with this email already exists');
        }
        const hashPassword = await (0, bcrypt_1.hash)(profileDto.password, 3);
        return this.profileService.saveProfile(Object.assign(Object.assign({}, profileDto), { password: hashPassword, avatar }));
    }
    async registerWithSSO(profileDto) {
        const profile = await this.profileService.getProfileByEmail(profileDto.email);
        if (profile) {
            return {
                access_token: this.jwtService.sign({
                    email: profile.email,
                    role: profile.role,
                }),
            };
        }
        const profileCreatedWithSSO = await this.profileService.saveProfileWithSSO(Object.assign({}, profileDto));
        return {
            access_token: this.jwtService.sign({
                email: profileCreatedWithSSO.email,
                role: profileCreatedWithSSO.role,
            }),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        profile_service_1.ProfileService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map