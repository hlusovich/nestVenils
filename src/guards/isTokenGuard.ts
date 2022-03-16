import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {ConfigService} from '@nestjs/config';
import {verify} from 'jsonwebtoken';

@Injectable()
export class isTokenGuard implements CanActivate {
    constructor(private configService: ConfigService) {
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            throw new UnauthorizedException('Pls provide token');
        }
        try {
            const secretKey: string | undefined = this.configService.get('SECRET_KEY');
            if (secretKey) {
                verify(
                    request.headers.authorization.split(' ')[1],
                    secretKey
                );
            }
        } catch (e) {
            throw new UnauthorizedException('Invalid jwt');
        }
        return true;
    }
}
