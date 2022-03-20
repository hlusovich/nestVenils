"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtModuleConfigAsync = void 0;
const config_1 = require("@nestjs/config");
exports.JwtModuleConfigAsync = {
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => {
        return {
            secret: configService.get('SECRET_KEY'),
        };
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=jwtAsyncConfig.js.map