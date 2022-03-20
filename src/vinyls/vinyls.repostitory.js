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
exports.VinylsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const uuid_1 = require("uuid");
const vinyls_schema_1 = require("../schemas/vinyls.schema");
let VinylsRepository = class VinylsRepository {
    constructor(vinylsModel) {
        this.vinylsModel = vinylsModel;
    }
    async getAllVinyls() {
        const vinyls = await this.vinylsModel.find();
        return vinyls;
    }
    async saveVinyl(vinylData) {
        const id = (0, uuid_1.v4)();
        const vinyl = new this.vinylsModel(Object.assign({ id }, vinylData));
        await vinyl.save();
        return vinyl;
    }
    async getVinylById(id) {
        const vinyl = await this.vinylsModel.findOne({ id });
        return vinyl;
    }
    async addVinylsReview(id, review) {
        const vinyl = await this.getVinylById(id);
        if (vinyl) {
            const reviews = vinyl.reviews;
            reviews.push(review);
            await this.vinylsModel.updateOne({ id }, { reviews });
        }
    }
    async deleteVinyl(id) {
        await this.vinylsModel.deleteOne({ id });
    }
};
VinylsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(vinyls_schema_1.Vinyl.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], VinylsRepository);
exports.VinylsRepository = VinylsRepository;
//# sourceMappingURL=vinyls.repostitory.js.map