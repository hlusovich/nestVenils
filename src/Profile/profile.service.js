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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const profile_repostitory_1 = require("./profile.repostitory");
let ProfileService = class ProfileService {
    constructor(profilesRepository) {
        this.profilesRepository = profilesRepository;
    }
    async saveProfile(userData) {
        const profile = await this.profilesRepository.saveProfile(userData);
        return this.getProfileData(profile);
    }
    async saveProfileWithSSO(userData) {
        const profile = await this.profilesRepository.saveProfile(userData);
        return this.getProfileData(profile);
    }
    async getAllProfiles() {
        const profiles = await this.profilesRepository.getAllProfiles();
        const profilesForRequest = [];
        for (let i = 0; i < profiles.length; i++) {
            const profile = this.getProfileData(profiles[i]);
            profilesForRequest.push(profile);
        }
        return profilesForRequest;
    }
    getProfileData(user) {
        const { firstName, lastName, id, email, birthDate, avatar, reviews, role, boughtedVinyls, } = user;
        return {
            firstName,
            email,
            id,
            lastName,
            birthDate,
            avatar,
            boughtedVinyls,
            reviews,
            role,
        };
    }
    async getProfileById(id) {
        const profile = await this.profilesRepository.getProfileById(id);
        if (!profile) {
            throw new common_1.BadRequestException("this user doesn't exist");
        }
        return this.getProfileData(profile);
    }
    async getProfileByEmail(email) {
        const profile = await this.profilesRepository.getProfileByEmail(email);
        return profile;
    }
    async updateProfile(id, newData, email, avatar) {
        const oldProfileDate = await this.getProfileById(id);
        if (email !== oldProfileDate.email) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        await this.profilesRepository.updateProfile(id, newData, avatar);
        const user = await this.profilesRepository.getProfileById(id);
        if (user) {
            return this.getProfileData(user);
        }
    }
    async addReview(review) {
        await this.getProfileById(review.userId);
        await this.profilesRepository.addReview(review.userId, review);
    }
    async buyVynil(profileId, boughtedVenil) {
        await this.getProfileById(profileId);
        await this.profilesRepository.buyVinyl(profileId, boughtedVenil);
        const profile = await this.getProfileById(profileId);
        return profile;
    }
};
ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [profile_repostitory_1.ProfileRepository])
], ProfileService);
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map