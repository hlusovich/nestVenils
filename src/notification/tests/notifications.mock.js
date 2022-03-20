"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockNotificationService = void 0;
exports.mockNotificationService = {
    sentNotification: jest.fn((email) => {
        return email;
    }),
};
//# sourceMappingURL=notifications.mock.js.map