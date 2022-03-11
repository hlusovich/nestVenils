import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ProfileModule} from "../Profile/profile.module";
import {GoogleController} from "./google.controller";
import {GoogleStrategy} from "./google.strategy";
import {JwtModuleConfigAsync} from "../authointefication/jwtAsyncConfig";
import {AuthModule} from "../authointefication/auth.module";

@Module({
    imports: [ProfileModule, JwtModule.registerAsync(JwtModuleConfigAsync)],
    controllers: [GoogleController],
    providers: [GoogleStrategy],
})
export class GoogleModule {
}

// email: 'bigklu95@gmail.com',
//     firstName: 'Никита',
//     lastName: 'Клусович',
//     picture: 'https://lh3.googleusercontent.com/a/AATXAJw1YXYtQ1zyIo_BbO3tVCPfO3a2fUi2RvddS5Wc=s96-c',
//     accessToken: 'ya29.A0ARrdaM9i_UIhgso4Sa_aaxud5zecoxBUtnVHXM3U6y44MXBUKOBhRRBw-zrso5dI-5jV7f5xLNFZfoBkNgkANSCYYX2Y5G1rOt6GhU-dzrcCaz-i0JfaVCHYHzfk8PnDG-dTB9F2YKZ661-B8Uwt_QzpGs8E'
