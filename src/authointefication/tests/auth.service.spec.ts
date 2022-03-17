import {Test, TestingModule} from "@nestjs/testing";
import {ProfileService} from "../../profile/profile.service";
import {
    mockProfileReporistory,
    profiles,
    removeProfiles,
    testProfile1,
    testProfile2
} from "../../profile/dto/tests/profile.mocks";
import {ProfileRepository} from "../../profile/profile.repostitory";
import {AuthService} from "../auth.service";
import {JwtModule, JwtService} from '@nestjs/jwt';
import {JwtModuleConfigAsync} from "../jwtAsyncConfig";
import {ProfileDocument} from "../../schemas/profile.schema";
import {Role} from "../../models/role.enum";
import {IProfileCreateDto, IProfileCreateDtoWithSSO, ProfileForRequest} from "../../profile/Profile.interface";
import {Token} from "../auth.interface";

describe("AuthService", () => {
    let service: AuthService;
    const tokenService = {
        sign(payload: { email: string, role: Role }) {
            return payload
        }
    };
    const loginData = {
        email: "testemail@gmail.com", role: Role.USER
    };
    const profileCreateDto: IProfileCreateDto = {
        email: "test@gmail.com",
        firstName: "Mikita",
        lastName: "klusovich",
        birthDate: "2020-11-11",
        password: "888"
    };

    const profileCreateDtoWirtSSo: IProfileCreateDtoWithSSO = {
        email: "testSSO@gmail.com",
        firstName: "Mikita",
        lastName: "klusovich",
    };
    beforeAll(() => {
        profiles.push(testProfile1);
        profiles.push(testProfile2);
    });
    afterAll(() => {
        removeProfiles();
    });
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.registerAsync(JwtModuleConfigAsync)],
            providers: [ProfileService, ProfileRepository, AuthService]
        }).overrideProvider(ProfileRepository).useValue(mockProfileReporistory)
            .overrideProvider(JwtService).useValue(tokenService).compile();
        service = module.get<AuthService>(AuthService);
    });
    it("AuthService should be defined", () => {
        expect(service).toBeDefined()
    });
    it("AuthService should return all vinyls", async () => {
        const token: Token = await service.login(loginData as unknown as ProfileDocument);
        expect(token.access_token).toEqual(tokenService.sign(loginData));

    });
    it("AuthService should register user if he doesn't exist", async () => {
        const profile: ProfileForRequest = await service.register(profileCreateDto);
        expect(profile.email).toBe(profileCreateDto.email);
        expect(profile.firstName).toBe(profileCreateDto.firstName);
        expect(profile.firstName).not.toHaveProperty("password");
        expect(mockProfileReporistory.saveProfile).toHaveBeenCalledTimes(1);
    });
    it("AuthService should return Error  he user exists", async () => {
        try {
            await service.register(profileCreateDto);
        } catch (e) {
            // @ts-ignore
            expect(e.status).toBe(400);
        }
    });
    it("AuthService should register user wit sso if he doesn't exist", async () => {
        const token: Token = await service.registerWithSSO (profileCreateDtoWirtSSo);
        expect(token.access_token).toEqual(tokenService.sign({email:profileCreateDtoWirtSSo.email, role:Role.USER}));
        expect(mockProfileReporistory.saveProfile).toHaveBeenCalledTimes(2);
    });
    it("AuthService should register user if he  exists", async () => {
        const token: Token = await service.registerWithSSO ({...profileCreateDtoWirtSSo, email:testProfile1.email});
        expect(token.access_token).toEqual(tokenService.sign({email:testProfile1.email, role:Role.USER}));
        expect(mockProfileReporistory.saveProfile).toHaveBeenCalledTimes(2);
    });

});

