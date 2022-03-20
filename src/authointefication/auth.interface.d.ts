/// <reference types="node" />
import { ProfileForRequest } from '../Profile/Profile.interface';
import { ProfileCreateDto } from '../Profile/dto/profileCreateDto';
import { LoginCreateDto } from './dto/loginCreateDto';
import { Buffer } from 'buffer';
export interface ILoginCreateDto {
    password: string;
    email: string;
}
export interface Token {
    access_token: string;
}
export interface TokenPayload {
    email: string;
    role: string;
}
export interface IAuthService {
    login(user: LoginCreateDto): Promise<Token>;
    register(profileDto: ProfileCreateDto, avatar: Buffer): Promise<ProfileForRequest>;
}
