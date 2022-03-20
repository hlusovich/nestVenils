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
exports.CustomDateValidator = void 0;
const class_validator_1 = require("class-validator");
const moment = require("moment");
let CustomDateValidator = class CustomDateValidator {
    constructor() {
        this.message = 'Invalid date format for birthDate date pls use YYYY-MM-DD';
    }
    validate(date) {
        return moment(date, 'YYYY-MM-DD').isValid();
    }
    defaultMessage(args) {
        return this.message;
    }
};
CustomDateValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'DateValidator', async: false }),
    __metadata("design:paramtypes", [])
], CustomDateValidator);
exports.CustomDateValidator = CustomDateValidator;
//# sourceMappingURL=dateValidator.js.map