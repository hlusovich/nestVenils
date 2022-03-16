import { BadRequestException, Injectable } from '@nestjs/common';
import { VinylsRepository } from './vinyls.repostitory';
import { IVinylCreateDto, IVinylForRequest } from './vinyls.interface';
import { VinylDocument } from '../schemas/vinyls.schema';
import { ProfileService } from '../profile/profile.service';
import { IReviewCreateDto } from '../reviews/review.interfaces';
import { v4 } from 'uuid';
import { ProfileForRequest } from '../profile/Profile.interface';

@Injectable()
export class VinylsService {
  constructor(
    private vinylsRepository: VinylsRepository,
    private profileService: ProfileService
  ) {}

  async saveVinyl(data: IVinylCreateDto): Promise<VinylDocument> {
    const vinyl: VinylDocument = await this.vinylsRepository.saveVinyl(data);
    return vinyl;
  }

  async getAllVinyls(): Promise<VinylDocument[]> {
    const vinyls: VinylDocument[] = await this.vinylsRepository.getAllVinyls();
    return vinyls;
  }

  async getVinylById(id: string): Promise<VinylDocument> {
    const vinyl: VinylDocument | null =
      await this.vinylsRepository.getVinylById(id);
    if (!vinyl) {
      throw new BadRequestException("this vinyl doesn't exist");
    }
    return vinyl;
  }

  async addVinylsReview(
    vinylId: string,
    userId: string,
    review: IReviewCreateDto
  ): Promise<VinylDocument> {
    await this.getVinylById(vinylId);
    const reviewId: string = v4();
    await this.vinylsRepository.addVinylsReview(vinylId, {
      ...review,
      id: reviewId,
      vinylId,
      userId,
    });
    await this.profileService.addReview({
      ...review,
      id: reviewId,
      vinylId,
      userId,
    });
    const vinyl: VinylDocument = await this.getVinylById(vinylId);
    return vinyl;
  }

  async addBoughtVynil(
    profileId: string,
    vinylId: string
  ): Promise<ProfileForRequest> {
    await this.profileService.getProfileById(profileId);
    const vinyl: VinylDocument = await this.getVinylById(vinylId);
    await this.profileService.buyVynil(profileId, {
      id: vinylId,
      name: vinyl.name,
    });
    const profile: ProfileForRequest = await this.profileService.getProfileById(
      profileId
    );
    return profile;
  }
}
