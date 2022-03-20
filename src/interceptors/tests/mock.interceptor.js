"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockInterceptor = void 0;
class MockInterceptor {
    async intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        console.log(req);
        return next.handle();
    }
}
exports.MockInterceptor = MockInterceptor;
//# sourceMappingURL=mock.interceptor.js.map