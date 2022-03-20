"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockVinylReporistory = exports.removeVinyls = exports.vinyls = exports.testVinyl2 = exports.testVinyl1 = void 0;
const uuid_1 = require("uuid");
exports.testVinyl1 = {
    id: (0, uuid_1.v4)(),
    price: '55',
    name: 'Bob Dilan',
    author: 'Bob Dilan',
    description: 'Music',
    reviews: [],
};
exports.testVinyl2 = {
    id: (0, uuid_1.v4)(),
    price: '55',
    name: 'Boris Grebenshikov',
    author: 'BG',
    description: 'Music',
    reviews: [],
};
exports.vinyls = [];
function removeVinyls() {
    exports.vinyls = [];
}
exports.removeVinyls = removeVinyls;
exports.mockVinylReporistory = {
    getAllVinyls: jest.fn(() => {
        return exports.vinyls;
    }),
    saveVinyl: jest.fn((vinylData) => {
        const id = (0, uuid_1.v4)();
        const vinyl = Object.assign(Object.assign({ id }, vinylData), { reviews: [] });
        exports.vinyls.push(vinyl);
        return vinyl;
    }),
    getVinylById: jest.fn((id) => {
        return exports.vinyls.find((vinyl) => vinyl.id === id);
    }),
    addVinylsReview: jest.fn((id, review) => {
        const vinyl = exports.vinyls.find((vinyl) => vinyl.id === id);
        if (vinyl) {
            const reviews = vinyl.reviews;
            reviews.push(review);
        }
    }),
};
//# sourceMappingURL=mocks.js.map