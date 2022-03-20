import { JwtService } from '@nestjs/jwt';
import { Token } from '../authointefication/auth.interface';
import { AuthService } from '../authointefication/auth.service';
import { IRequestUserWithSSO } from '../Profile/Profile.interface';
export declare class GoogleController {
    private jwtService;
    private authService;
    constructor(jwtService: JwtService, authService: AuthService);
    redirect(): void;
    googleAuthRedirect(req: IRequestUserWithSSO): Promise<Token>;
}
