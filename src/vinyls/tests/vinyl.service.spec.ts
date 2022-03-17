import {Test, TestingModule} from "@nestjs/testing";
import {v4} from "uuid";
import {IReview, IReviewCreateDto} from "../../reviews/review.interfaces";
import {IVinyl, IVinylCreateDto} from "../vinyls.interface";
import {ProfileService} from "../../profile/profile.service";
import {ProfileRepository} from "../../profile/profile.repostitory";
import {
    mockProfileReporistory, profiles, removeProfiles,
    testProfile1,
    testProfile2
} from "../../profile/dto/tests/profile.mocks";
import {VinylsRepository} from "../vinyls.repostitory";
import {VinylsService} from "../vinyls.service";
import {NotificationService} from "../../notification/notification.service";
import {mockNotificationService} from "../../notification/tests/notifications.mock";
import {mockVinylReporistory, removeVinyls, testVinyl1, testVinyl2, vinyls} from "./mocks";
import {ProfileForRequest} from "../../profile/Profile.interface";


describe("ProfileService", () => {
    beforeAll(() => {
        vinyls.push(testVinyl1);
        vinyls.push(testVinyl2);
        profiles.push(testProfile1);
        profiles.push(testProfile2);
    });
    afterAll(() => {
        removeVinyls();
        removeProfiles();
    });
    let vinylService: VinylsService;
    let profileService: ProfileService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VinylsService, VinylsRepository, ProfileService, ProfileRepository, NotificationService]
        }).overrideProvider(ProfileRepository).useValue(mockProfileReporistory)
            .overrideProvider(VinylsRepository).useValue(mockVinylReporistory)
            .overrideProvider(NotificationService).useValue(mockNotificationService)
            .compile();
        vinylService = module.get<VinylsService>(VinylsService);
        profileService = module.get<ProfileService>(ProfileService);
    });
    it("VinylService should be defined", () => {
        expect(vinylService).toBeDefined()
    });
    it("VinylService should return all vinyls", async () => {
        const vinyls: IVinyl[] = await vinylService.getAllVinyls();
        expect(mockVinylReporistory.getAllVinyls).toHaveBeenCalledTimes(1);
    });
    it("VinylService should create vinyl", async () => {
        const vinylDto: IVinylCreateDto = {
            price: '66',
            name: "New Vinyl",
            author: "New Author",
            description: "Cool",
        };
        const vinyl: IVinyl = await vinylService.saveVinyl(vinylDto);
        expect(vinyl.author).toBe(vinylDto.author);
    });
    it("VinylService should return vinyl by id", async () => {
        const vinyl: IVinyl = await vinylService.getVinylById(testVinyl1.id);
        expect(vinyl.price).toBe(testVinyl1.price);
    });
    it("VinylService should return error if vinyl doesn't exist", async () => {
        const incorrectId: string = v4();
        try {
            await vinylService.getVinylById(incorrectId);
        } catch (e) {
            // @ts-ignore
            expect(e.status).toBe(400);
        }
    });
    it("VinylService should add review", async () => {
        const reviewDto: IReviewCreateDto = {
            comment: "string",
            vinylScore: "5",
        };
        await vinylService.addVinylsReview(testVinyl1.id, testProfile1.id, reviewDto);
        const profile: ProfileForRequest | void = await profileService.getProfileById(testProfile1.id);
        const vinyl: IVinyl | undefined = await vinylService.getVinylById(testVinyl1.id);
        expect(profile?.reviews.length).toBe(1);
        expect(vinyl?.reviews.length).toBe(1);
    });
    it("VinylService should throw error if reviews profile doesn't exist", async () => {
        try {
            const reviewDto: IReviewCreateDto = {
                comment: "string",
                vinylScore: "5",
            };
            const incorrectId: string = v4();
            await vinylService.addVinylsReview(incorrectId, testProfile1.id, reviewDto);
        } catch (e) {
            // @ts-ignore
            expect(e.status).toBe(400);
        }
    });
    it("VinylService should throw error if reviews profile doesn't exist", async () => {
        try {
            const reviewDto: IReviewCreateDto = {
                comment: "string",
                vinylScore: "5",
            };
            const incorrectId: string = v4();
            await vinylService.addVinylsReview(testVinyl1.id, incorrectId, reviewDto);
        } catch (e) {
            // @ts-ignore
            expect(e.status).toBe(400);
        }
    });
    it("VinylService should return vinyl by id", async () => {
        const profile: ProfileForRequest = await vinylService.addBoughtVynil(testProfile1.id, testVinyl1.id);
        expect(profile.boughtedVinyls.find(vinyl=> vinyl.id=== testVinyl1.id)?.name).toBe(testVinyl1.name);
    });
});

