import {Test, TestingModule} from "@nestjs/testing";
import {ProfileRepository} from "../../profile/profile.repostitory";
import {MongoDBModule} from "../../mongoose/mongoose.module";
import {MongooseModule} from "@nestjs/mongoose";
import { VinylDocument} from "../../schemas/vinyls.schema";
import {ConfigModule} from "@nestjs/config";
import {config} from "../../app.module";
import {INestApplication} from "@nestjs/common";
import {IProfileCreateDto} from "../Profile.interface";
import {Profile, ProfileDocument, ProfileSchema} from "../../schemas/profile.schema";
import {IReview} from "../../reviews/review.interfaces";
import {v4} from "uuid";
import {IBoughtedVinyl} from "../../boughtedVinyls/boughtedVinyl.interfaces";


describe("ProfileRepository", () => {
    let profileRepository: ProfileRepository;
    let profile: ProfileDocument;
    let app: INestApplication;
    const profileDto: IProfileCreateDto = {
        firstName: "Mikita",
    lastName: "Klusovich",
    password: "777",
    email: "testemai@gmail.com",
    birthDate: "1995-12-17"
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({
                isGlobal: true,
                load: [config]
            }), MongoDBModule, MongooseModule.forFeature([{name: Profile.name, schema: ProfileSchema}]),],
            providers: [ProfileRepository]
        }).compile();
        profileRepository = module.get<ProfileRepository>(ProfileRepository);
        app = module.createNestApplication();
        await app.init();
    });
    it("should be defined", () => {
        expect(profileRepository).toBeDefined()
    });
    it("should create profile", async () => {
        profile = await profileRepository.saveProfile(profileDto);
        expect(profile.firstName).toBe(profileDto.firstName);
        expect(profile.lastName).toBe(profileDto.lastName);
        expect(profile.email).toBe(profileDto.email);
        expect(profile.birthDate).toBe(profileDto.birthDate);
    });
    it("should get all profiles", async () => {
        const profilesFromBd: ProfileDocument[] = await profileRepository.getAllProfiles();
        expect(profilesFromBd.find(p => p.id === profile.id)?.firstName).toBe(profile.firstName);
    },10000);
    it("should update profile", async () => {
        const firstName= "newNameForTest";
        await profileRepository.updateProfile(profile.id, {firstName});
        const profileFromBd: ProfileDocument | null = await profileRepository.getProfileById(profile.id);
        expect(profileFromBd?.firstName).toBe(firstName);
    });

    it("should get profile by id", async () => {
        const profileFromBd: ProfileDocument | null = await profileRepository.getProfileById(profile.id);
        expect(profileFromBd?.id).toBe(profile.id);
    });
    it("should get profile by email", async () => {
        const profileFromBd: ProfileDocument | null = await profileRepository.getProfileByEmail(profile.email);
        expect(profileFromBd?.id).toBe(profile.id);
    });
    it("should add review to profile", async () => {
        const review: IReview = {
            id: v4(),
            comment: "string",
            vinylScore: "5",
            userId: v4(),
            vinylId: v4()
        };
        await profileRepository.addReview(profile.id, review);
        const profileFromBd: ProfileDocument | null = await profileRepository.getProfileById(profile.id);
        expect(profileFromBd?.reviews?.find(r => r.id === r.id)?.userId).toBe(review.userId);
    });
    it("should add boughted vinyl to profile", async () => {
        const boughtedVinyl: IBoughtedVinyl = {
            id: v4(),
            name: "string",
        };
        await profileRepository.buyVinyl(profile.id, boughtedVinyl);
        const profileFromBd: ProfileDocument | null = await profileRepository.getProfileById(profile.id);
        expect(profileFromBd?.boughtedVinyls?.find(b => b.id === boughtedVinyl.id)?.name).toBe(boughtedVinyl.name);
    });
    it("should delete profile", async () => {
        const profileFromBdBeforeDeletion: ProfileDocument | null = await profileRepository.getProfileById(profile.id);
        expect(profileFromBdBeforeDeletion?.id).toBe(profile.id);
        await profileRepository.deleteProfile(profile.id);
        const profileFromBdAfterDeletion: ProfileDocument | null = await profileRepository.getProfileById(profile.id);
        expect(profileFromBdAfterDeletion).toBe(null);
    });
    afterAll(async () => {
        await app.close();
    });
});

