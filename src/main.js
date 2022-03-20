"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
const exceptionFilter_1 = require("./exceptionfilters/exceptionFilter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Vinyls')
        .setVersion('1.0')
        .addTag('vinyls')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('swagger', app, document);
    app.useGlobalFilters(new exceptionFilter_1.HttpExceptionFilter());
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') | 5000;
    aws_sdk_1.config.update({
        accessKeyId: configService.get('ACCESS_KEY_ID'),
        secretAccessKey: configService.get('SECRET_ACCESS_KEY'),
        region: configService.get('REGION'),
    });
    await app.listen(port);
    console.log('started on port ' + port);
    return app;
}
exports.bootstrap = bootstrap;
bootstrap();
//# sourceMappingURL=main.js.map