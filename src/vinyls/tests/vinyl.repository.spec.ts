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
} from "../../profile/tests/profile.mocks";
import {VinylsRepository} from "../vinyls.repostitory";
import {VinylsService} from "../vinyls.service";
import {NotificationService} from "../../notification/notification.service";
import {mockNotificationService} from "../../notification/tests/notifications.mock";
import {mockVinylReporistory, removeVinyls, testVinyl1, testVinyl2, vinyls} from "./mocks";
import {ProfileForRequest} from "../../profile/Profile.interface";
import {MongoDBModule} from "../../mongoose/mongoose.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Vinyl, VinylDocument, VinylSchema} from "../../schemas/vinyls.schema";
import {ConfigModule} from "@nestjs/config";
import {config} from "../../app.module";
import {INestApplication} from "@nestjs/common";


describe("VinylsRepository", () => {
    let vinylsRepository: VinylsRepository;
    let vinyl: VinylDocument;
    let app: INestApplication;
    const vinylDto: IVinylCreateDto = {
        price: "5",
        name: "Vinyl",
        author: "Bob dilan",
        description: "hurricane",
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({
                isGlobal: true,
                load: [config]
            }), MongoDBModule, MongooseModule.forFeature([{name: Vinyl.name, schema: VinylSchema}]),],
            providers: [VinylsRepository]
        }).compile();
        vinylsRepository = module.get<VinylsRepository>(VinylsRepository);
        app = module.createNestApplication();
        await app.init();
    });
    it("should be defined", () => {
        expect(vinylsRepository).toBeDefined()
    });
    it("should create vinyl", async () => {
        vinyl = await vinylsRepository.saveVinyl(vinylDto);
        expect(vinyl.author).toBe(vinylDto.author);
        expect(vinyl.description).toBe(vinylDto.description);
        expect(vinyl.price).toBe(vinylDto.price);
        expect(vinyl.name).toBe(vinylDto.name);
    });

    it("should get vinyl by id", async () => {
        const vinylFromBd: VinylDocument | null = await vinylsRepository.getVinylById(vinyl.id);
        expect(vinylFromBd?.id).toBe(vinyl.id);
    });
    it("should get all vinyls", async () => {
        const vinylsFromBd: VinylDocument[] = await vinylsRepository.getAllVinyls();
        expect(vinylsFromBd.find(v => v.id === vinyl.id)?.name).toBe(vinyl.name);
    });
    it("should add review to vinyl", async () => {
        const review: IReview = {
            id: v4(),
            comment: "string",
            vinylScore: "5",
            userId: v4(),
            vinylId: v4()
        };
        await vinylsRepository.addVinylsReview(vinyl.id, review);
        const vinylFromBd: VinylDocument | null = await vinylsRepository.getVinylById(vinyl.id);
        expect(vinylFromBd?.reviews?.find(r => r.id === r.id)?.userId).toBe(review.userId);
    });
    it("should delete vinyl", async () => {
        const vinylFromBdBeforeDeletion: VinylDocument | null = await vinylsRepository.getVinylById(vinyl.id);
        expect(vinylFromBdBeforeDeletion?.id).toBe(vinyl.id);
        await vinylsRepository.deleteVinyl(vinyl.id);
        const vinylFromBdAfterDeletion: VinylDocument | null = await vinylsRepository.getVinylById(vinyl.id);
        expect(vinylFromBdAfterDeletion).toBe(null);
    });
    afterAll(async () => {
        await app.close();
    });
});

