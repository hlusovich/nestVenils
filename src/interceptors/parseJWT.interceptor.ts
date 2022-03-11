import {Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {JwtPayload} from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import * as jsonwebtoken from "jsonwebtoken";

@Injectable()
export class ParseJWTInterceptor implements NestInterceptor {
    constructor(private configService: ConfigService) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const authToken: string = req.headers.authorization;
        if (authToken) {

            const splitedAuthorization: string = authToken.split(' ')[1];
            const secret: string = this.configService.get("SECRET_KEY");
            try {
                const decoded: JwtPayload | string = jsonwebtoken.verify(splitedAuthorization, secret);
                if (typeof decoded !== "string") {
                    req.headers.authorization = decoded.email;
                }
            } catch (e) {
                throw new BadRequestException("Token is invalid")
            }

        }
        return next
            .handle()
    }
}
