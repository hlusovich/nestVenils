import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class CustomDateValidator implements ValidatorConstraintInterface {
    message: string;
    constructor();
    validate(date: string): boolean;
    defaultMessage(args: ValidationArguments): string;
}
