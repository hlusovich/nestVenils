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
exports.ProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const profile_schema_1 = require("../schemas/profile.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const uuid_1 = require("uuid");
let ProfileRepository = class ProfileRepository {
    constructor(profileModel) {
        this.profileModel = profileModel;
    }
    async getAllProfiles() {
        const profiles = await this.profileModel.find();
        return profiles;
    }
    async saveProfile(profileData) {
        const id = (0, uuid_1.v4)();
        const profile = new this.profileModel(Object.assign({ id }, profileData));
        await profile.save();
        return profile;
    }
    async getProfileById(id) {
        const user = await this.profileModel.findOne({
            id,
        });
        return user;
    }
    async getProfileByEmail(email) {
        const user = await this.profileModel.findOne({
            email,
        });
        return user;
    }
    async deleteProfile(id) {
        await this.profileModel.deleteOne({ id });
    }
    async updateProfile(id, newData, avatar) {
        await this.profileModel.updateOne({ id }, Object.assign(Object.assign({}, newData), { avatar }));
    }
    async addReview(id, review) {
        const profile = await this.getProfileById(id);
        if (profile) {
            const reviews = profile.reviews;
            reviews.push(review);
            await this.profileModel.updateOne({ id }, { reviews });
        }
    }
    async buyVinyl(id, boughtVinyl) {
        const profile = await this.getProfileById(id);
        if (profile) {
            const boughtedVinyls = profile.boughtedVinyls;
            boughtedVinyls.push(boughtVinyl);
            await this.profileModel.updateOne({ id }, { boughtedVinyls });
        }
    }
};
ProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(profile_schema_1.Profile.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], ProfileRepository);
exports.ProfileRepository = ProfileRepository;
//# sourceMappingURL=profile.repostitory.js.map