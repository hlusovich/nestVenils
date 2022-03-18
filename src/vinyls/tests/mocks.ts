import { IVinyl, IVinylCreateDto } from '../vinyls.interface';
import { v4 } from 'uuid';
import { IReview } from '../../reviews/review.interfaces';

export const testVinyl1: IVinyl = {
  id: v4(),
  price: '55',
  name: 'Bob Dilan',
  author: 'Bob Dilan',
  description: 'Music',
  reviews: [],
};
export const testVinyl2: IVinyl = {
  id: v4(),
  price: '55',
  name: 'Boris Grebenshikov',
  author: 'BG',
  description: 'Music',
  reviews: [],
};
export let vinyls: IVinyl[] = [];
export function removeVinyls(): void {
  vinyls = [];
}
export const mockVinylReporistory = {
  getAllVinyls: jest.fn((): IVinyl[] => {
    return vinyls;
  }),
  saveVinyl: jest.fn((vinylData: IVinylCreateDto): IVinyl => {
    const id: string = v4();
    const vinyl: IVinyl = { id, ...vinylData, reviews: [] };
    vinyls.push(vinyl);
    return vinyl;
  }),
  getVinylById: jest.fn((id: string): IVinyl | undefined => {
    return vinyls.find((vinyl) => vinyl.id === id);
  }),
  addVinylsReview: jest.fn((id: string, review: IReview): void => {
    const vinyl: IVinyl | undefined = vinyls.find((vinyl) => vinyl.id === id);
    if (vinyl) {
      const reviews: IReview[] = vinyl.reviews;
      reviews.push(review);
    }
  }),
};
