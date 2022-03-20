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
exports.VinylsService = void 0;
const common_1 = require("@nestjs/common");
const vinyls_repostitory_1 = require("./vinyls.repostitory");
const profile_service_1 = require("../Profile/profile.service");
const uuid_1 = require("uuid");
let VinylsService = class VinylsService {
    constructor(vinylsRepository, profileService) {
        this.vinylsRepository = vinylsRepository;
        this.profileService = profileService;
    }
    async saveVinyl(data) {
        const vinyl = await this.vinylsRepository.saveVinyl(data);
        return vinyl;
    }
    async getAllVinyls() {
        const vinyls = await this.vinylsRepository.getAllVinyls();
        return vinyls;
    }
    async getVinylById(id) {
        const vinyl = await this.vinylsRepository.getVinylById(id);
        if (!vinyl) {
            throw new common_1.BadRequestException("this vinyl doesn't exist");
        }
        return vinyl;
    }
    async addVinylsReview(vinylId, userId, review) {
        await this.getVinylById(vinylId);
        const reviewId = (0, uuid_1.v4)();
        await this.vinylsRepository.addVinylsReview(vinylId, Object.assign(Object.assign({}, review), { id: reviewId, vinylId,
            userId }));
        await this.profileService.addReview(Object.assign(Object.assign({}, review), { id: reviewId, vinylId,
            userId }));
        const vinyl = await this.getVinylById(vinylId);
        return vinyl;
    }
    async addBoughtVynil(profileId, vinylId) {
        await this.profileService.getProfileById(profileId);
        const vinyl = await this.getVinylById(vinylId);
        await this.profileService.buyVynil(profileId, {
            id: vinylId,
            name: vinyl.name,
        });
        const profile = await this.profileService.getProfileById(profileId);
        return profile;
    }
};
VinylsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vinyls_repostitory_1.VinylsRepository,
        profile_service_1.ProfileService])
], VinylsService);
exports.VinylsService = VinylsService;
//# sourceMappingURL=vinyls.service.js.map
