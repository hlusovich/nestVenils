import { IProfileCreateDtoForUpdate } from '../Profile.interface';
export declare class ProfileUpdateDto implements IProfileCreateDtoForUpdate {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
}
