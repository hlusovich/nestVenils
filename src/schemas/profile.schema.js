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
exports.ProfileSchema = exports.Profile = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var role_enum_1 = require("../models/role.enum");
var Profile = (function () {
    function Profile() {
    }
    __decorate([
        (0, mongoose_1.Prop)({ unique: true }),
        __metadata("design:type", String)
    ], Profile.prototype, "id", void 0);
    __decorate([
        (0, mongoose_1.Prop)(),
        __metadata("design:type", String)
    ], Profile.prototype, "firstName", void 0);
    __decorate([
        (0, mongoose_1.Prop)(),
        __metadata("design:type", String)
    ], Profile.prototype, "lastName", void 0);
    __decorate([
        (0, mongoose_1.Prop)(),
        __metadata("design:type", String)
    ], Profile.prototype, "password", void 0);
    __decorate([
        (0, mongoose_1.Prop)(),
        __metadata("design:type", String)
    ], Profile.prototype, "email", void 0);
    __decorate([
        (0, mongoose_1.Prop)(),
        __metadata("design:type", String)
    ], Profile.prototype, "birthDate", void 0);
    __decorate([
        (0, mongoose_1.Prop)({ default: undefined }),
        __metadata("design:type", String)
    ], Profile.prototype, "avatar", void 0);
    __decorate([
        (0, mongoose_1.Prop)({ default: [] }),
        __metadata("design:type", Array)
    ], Profile.prototype, "boughtedVinyls", void 0);
    __decorate([
        (0, mongoose_1.Prop)({ default: [] }),
        __metadata("design:type", Array)
    ], Profile.prototype, "reviews", void 0);
    __decorate([
        (0, mongoose_1.Prop)({ default: 'user' }),
        __metadata("design:type", String)
    ], Profile.prototype, "role", void 0);
    Profile = __decorate([
        (0, mongoose_1.Schema)()
    ], Profile);
    return Profile;
}());
exports.Profile = Profile;
exports.ProfileSchema = mongoose_1.SchemaFactory.createForClass(Profile);
