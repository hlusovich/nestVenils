import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({name: 'DateValidator', async: false})
export class CustomDateValidator implements ValidatorConstraintInterface {
    message: string;

    constructor() {
        this.message = 'Invalid date format for birthDate date pls use YYYY-MM-DD';
    }

    validate(date: string): boolean {
        return moment(date, 'YYYY-MM-DD').isValid();
    }

    defaultMessage(args: ValidationArguments): string {
        return this.message;
    }
}
