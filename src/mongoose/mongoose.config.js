"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseAsyncConfig = void 0;
const config_1 = require("@nestjs/config");
exports.mongooseAsyncConfig = {
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => {
        console.log(configService.get('MONGO_DB_CONNECTION'))
        return {
            uri: configService.get('MONGO_DB_CONNECTION'),
        };
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=mongoose.config.js.map
