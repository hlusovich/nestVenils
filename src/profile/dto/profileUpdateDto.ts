import {IProfileCreateDtoForUpdate} from "../Profile.interface";
import {IsOptional, IsString, Validate} from "class-validator";
import {CustomDateValidator} from "../../validators/dateValidator";

export class ProfileUpdateDto implements IProfileCreateDtoForUpdate {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @Validate(CustomDateValidator)
    birthDate:string;

}
