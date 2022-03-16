"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinylsRepository = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var mongoose_2 = require("@nestjs/mongoose");
var uuid_1 = require("uuid");
var vinyls_schema_1 = require("../schemas/vinyls.schema");
var VinylsRepository = (function () {
    function VinylsRepository(vinylsModel) {
        this.vinylsModel = vinylsModel;
    }
    VinylsRepository.prototype.getAllVinyls = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vinyls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.vinylsModel.find()];
                    case 1:
                        vinyls = _a.sent();
                        return [2, vinyls];
                }
            });
        });
    };
    VinylsRepository.prototype.saveVinyl = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, vinyl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (0, uuid_1.v4)();
                        vinyl = new this.vinylsModel(__assign({ id: id }, userData));
                        return [4, vinyl.save()];
                    case 1:
                        _a.sent();
                        return [2, vinyl];
                }
            });
        });
    };
    VinylsRepository.prototype.getVinylById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var vinyl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.vinylsModel.findOne({ id: id })];
                    case 1:
                        vinyl = _a.sent();
                        return [2, vinyl];
                }
            });
        });
    };
    VinylsRepository.prototype.addVinylsReview = function (id, review) {
        return __awaiter(this, void 0, void 0, function () {
            var vinyl, reviews;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getVinylById(id)];
                    case 1:
                        vinyl = _a.sent();
                        if (!vinyl) return [3, 3];
                        reviews = vinyl.reviews;
                        reviews.push(review);
                        return [4, this.vinylsModel.updateOne({ id: id }, { reviews: reviews })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    VinylsRepository = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, mongoose_2.InjectModel)(vinyls_schema_1.Vinyl.name)),
        __metadata("design:paramtypes", [mongoose_1.Model])
    ], VinylsRepository);
    return VinylsRepository;
}());
exports.VinylsRepository = VinylsRepository;
