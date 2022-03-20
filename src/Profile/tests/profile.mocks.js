"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockProfileReporistory = exports.removeProfiles = exports.profiles = exports.testProfile2 = exports.testProfile1 = void 0;
const uuid_1 = require("uuid");
const role_enum_1 = require("../../models/role.enum");
exports.testProfile1 = {
    id: (0, uuid_1.v4)(),
    firstName: 'Mikita',
    lastName: 'Klusovich',
    password: '42',
    email: 'testemail@gmail.com',
    birthDate: '1111-11-11',
    boughtedVinyls: [],
    reviews: [],
    role: role_enum_1.Role.USER,
};
exports.testProfile2 = {
    id: (0, uuid_1.v4)(),
    firstName: 'Ilon',
    lastName: 'Mask',
    password: '43',
    email: 'spaceX@gmail.com',
    birthDate: '1111-11-11',
    boughtedVinyls: [],
    reviews: [],
    role: role_enum_1.Role.USER,
};
exports.profiles = [];
function removeProfiles() {
    exports.profiles = [];
}
exports.removeProfiles = removeProfiles;
exports.mockProfileReporistory = {
    getAllProfiles: jest.fn(() => {
        return exports.profiles;
    }),
    saveProfile: jest.fn((profileData) => {
        const id = (0, uuid_1.v4)();
        const profile = Object.assign(Object.assign({ id }, profileData), { role: role_enum_1.Role.USER, reviews: [], boughtedVinyls: [] });
        exports.profiles.push(profile);
        return profile;
    }),
    getProfileById: jest.fn((id) => {
        return exports.profiles.find((profile) => profile.id === id);
    }),
    getProfileByEmail: jest.fn((email) => {
        return exports.profiles.find((profile) => profile.email === email);
    }),
    updateProfile: jest.fn((id, newData) => {
        exports.profiles = exports.profiles.map((profile) => {
            if (profile.id === id) {
                return Object.assign(Object.assign({}, profile), newData);
            }
            return profile;
        });
        return exports.profiles.find((profile) => profile.id === id);
    }),
    addReview: jest.fn((userId, review) => {
        const profile = exports.profiles.find((profile) => profile.id === userId);
        if (profile) {
            profile === null || profile === void 0 ? void 0 : profile.reviews.push(review);
        }
    }),
    buyVinyl: jest.fn((userId, boughtVinyl) => {
        const profile = exports.profiles.find((profile) => profile.id === userId);
        if (profile) {
            profile === null || profile === void 0 ? void 0 : profile.boughtedVinyls.push(boughtVinyl);
        }
    }),
};
//# sourceMappingURL=profile.mocks.js.map