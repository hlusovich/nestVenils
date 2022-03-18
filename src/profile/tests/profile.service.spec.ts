import {Test, TestingModule} from "@nestjs/testing";
import {ProfileService} from "../profile.service";
import {v4} from "uuid";
import {IProfileCreateDtoForUpdate, ProfileForRequest} from "../Profile.interface";
import {ProfileDocument} from "../../schemas/profile.schema";
import {ProfileRepository} from "../profile.repostitory";
import {IReview} from "../../reviews/review.interfaces";
import {IBoughtedVinyl} from "../../boughtedVinyls/boughtedVinyl.interfaces";
import {mockProfileReporistory, profiles, removeProfiles, testProfile1, testProfile2} from "./profile.mocks";


describe("ProfileService", () => {
    let service: ProfileService;
    beforeAll(()=>{
        profiles.push(testProfile1);
        profiles.push(testProfile2);
    });
    afterAll(()=>{
        removeProfiles();
    });
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProfileService,  ProfileRepository]
        }).overrideProvider(ProfileRepository).useValue(mockProfileReporistory).compile();
        service = module.get<ProfileService>(ProfileService);
    });
    it("ProfileService should be defined", () => {
        expect(service).toBeDefined()
    });
    it("ProfileService should return all profiles", async () => {
        const profiles: ProfileForRequest[] = await service.getAllProfiles();
        expect(mockProfileReporistory.getAllProfiles).toHaveBeenCalledTimes(1);
        profiles.map(profile => expect(profile).not.toHaveProperty("password"));
    });
    it("ProfileService should return profile by id", async () => {
        const profile: ProfileForRequest = await service.getProfileById(testProfile1.id);
        expect(profile.firstName).toBe(testProfile1.firstName);
        expect(profile).not.toHaveProperty("password");
    });
    it("ProfileService should return profile by email", async () => {
        const profile: ProfileDocument | null = await service.getProfileByEmail(testProfile1.email);
        expect(profile?.firstName).toBe(testProfile1.firstName);
    });
    it("ProfileService should save profile", async () => {
        const profileForSave = {
            firstName: "Ilon",
            lastName: "Mask",
            password: "43",
            email: "spaceX@gmail.com",
            birthDate: "1111-11-11",
        };
        const profile: ProfileForRequest = await service.saveProfile(profileForSave);
        expect(profile?.firstName).toBe(profileForSave.firstName);
        expect(profile).not.toHaveProperty("password")
    });
    it("ProfileService should save profile for sso", async () => {
        const profileForSave = {
            firstName: "Ilon",
            lastName: "Mask",
            email: "spaceX@gmail.com"
        };
        const profile: ProfileForRequest = await service.saveProfileWithSSO(profileForSave);
        expect(profile?.firstName).toBe(profileForSave.firstName);
        expect(profile).not.toHaveProperty("password")
    });
    it("ProfileService should return all profiles", async () => {
        const profiles: ProfileForRequest[] = await service.getAllProfiles();
        expect(mockProfileReporistory.getAllProfiles).toHaveBeenCalledTimes(2);
        profiles.map(profile => expect(profile).not.toHaveProperty("password"));
    });
    it("ProfileService should update profile", async () => {
        const profileForUpdate: IProfileCreateDtoForUpdate = {
            firstName: "NewName"
        };
        const profile: ProfileForRequest | void = await service.updateProfile(testProfile2.id, profileForUpdate, testProfile2.email);
        expect(profile?.firstName).toBe(profileForUpdate.firstName);
        expect(profile).not.toHaveProperty("password")
    });
    it("ProfileService should throw error if emails aren't equals", async () => {
        try{
            const profileForUpdate: IProfileCreateDtoForUpdate = {
                firstName: "NewName"
            };
            await service.updateProfile(testProfile2.id, profileForUpdate, testProfile1.email);}
        catch (e) {
            // @ts-ignore
            expect(e.status).toBe(401);
        }
    });
    it("ProfileService should throw error if profile doesn't exist", async () => {
        const incorrectId = v4();
        try{
            const profileForUpdate: IProfileCreateDtoForUpdate = {
                firstName: "NewName"
            };
            await service.updateProfile(incorrectId, profileForUpdate, testProfile1.email);}
        catch (e) {
            // @ts-ignore
            expect(e.status).toBe(400);
        }
    });
    it("ProfileService should add review", async () => {
        const review: IReview = {
            id: v4(),
            comment: "string",
            vinylScore: "5",
            userId: testProfile2.id,
            vinylId: v4(),
        };
        await service.addReview(review);
        const profile: ProfileForRequest | void = await service.getProfileById(review.userId);
        expect(profile?.reviews.length).toBe(1);
        await service.addReview(review);
        expect(profile?.reviews.length).toBe(2);
        expect(profile?.reviews.find(item=>item.id===review.id)?.vinylId).toBe(review.vinylId)

    });

    it("ProfileService should add boughtedVinyl", async () => {
        const boughtedVinyl: IBoughtedVinyl = {
            id: v4(),
            name: "Vinyl"
        };
        await service.buyVynil(testProfile1.id, boughtedVinyl);
        const profile: ProfileForRequest | void = await service.getProfileById(testProfile1.id);
        expect(profile?.boughtedVinyls.length).toBe(1);
        await service.buyVynil(testProfile1.id, boughtedVinyl);
        expect(profile?.boughtedVinyls.length).toBe(2);
        expect(profile?.boughtedVinyls.find(item=>item.id===boughtedVinyl.id)?.name).toBe(boughtedVinyl.name)

    });
    it("ProfileService should return error if profile doesn't exist", async () => {
        const incorrectId:string = v4();
        try {
            await service.getProfileById(incorrectId);
        }
        catch (e) {
            // @ts-ignore
            expect(e.status).toBe(400);
        }
    });
});

