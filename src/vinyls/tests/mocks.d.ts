/// <reference types="jest" />
import { IVinyl, IVinylCreateDto } from '../vinyls.interface';
import { IReview } from '../../reviews/review.interfaces';
export declare const testVinyl1: IVinyl;
export declare const testVinyl2: IVinyl;
export declare let vinyls: IVinyl[];
export declare function removeVinyls(): void;
export declare const mockVinylReporistory: {
    getAllVinyls: jest.Mock<IVinyl[], []>;
    saveVinyl: jest.Mock<IVinyl, [vinylData: IVinylCreateDto]>;
    getVinylById: jest.Mock<IVinyl | undefined, [id: string]>;
    addVinylsReview: jest.Mock<void, [id: string, review: IReview]>;
};
