"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinylsModule = void 0;
const common_1 = require("@nestjs/common");
const vinyls_controller_1 = require("./vinyls.controller");
const vinyls_service_1 = require("./vinyls.service");
const mongoose_1 = require("@nestjs/mongoose");
const vinyls_schema_1 = require("../schemas/vinyls.schema");
const vinyls_repostitory_1 = require("./vinyls.repostitory");
const profile_module_1 = require("../Profile/profile.module");
const notification_service_1 = require("../notification/notification.service");
let VinylsModule = class VinylsModule {
};
VinylsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: vinyls_schema_1.Vinyl.name, schema: vinyls_schema_1.VinylSchema }]),
            profile_module_1.ProfileModule,
        ],
        providers: [vinyls_service_1.VinylsService, vinyls_repostitory_1.VinylsRepository, notification_service_1.NotificationService],
        controllers: [vinyls_controller_1.VinylsController],
        exports: [vinyls_service_1.VinylsService],
    })
], VinylsModule);
exports.VinylsModule = VinylsModule;
//# sourceMappingURL=vinyls.module.js.map
