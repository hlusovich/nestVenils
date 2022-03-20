"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const profile_controller_1 = require("./profile.controller");
const profile_service_1 = require("./profile.service");
const profile_repostitory_1 = require("./profile.repostitory");
const mongoose_1 = require("@nestjs/mongoose");
const profile_schema_1 = require("../schemas/profile.schema");
const config_1 = require("@nestjs/config");
const RoleGuard_1 = require("../guards/RoleGuard");
let ProfileModule = class ProfileModule {
};
ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: profile_schema_1.Profile.name, schema: profile_schema_1.ProfileSchema }]),
            config_1.ConfigModule,
        ],
        providers: [RoleGuard_1.RoleGuard, profile_service_1.ProfileService, profile_repostitory_1.ProfileRepository],
        controllers: [profile_controller_1.ProfileController],
        exports: [profile_service_1.ProfileService],
    })
], ProfileModule);
exports.ProfileModule = ProfileModule;
//# sourceMappingURL=profile.module.js.map