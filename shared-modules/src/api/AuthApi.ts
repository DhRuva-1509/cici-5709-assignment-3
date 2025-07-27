import {HttpClient} from "./HttpClient";
import type {LoginRequestDto} from "../dtos/authentication/Login/LoginRequestDto";
import type {ForgotPasswordRequestDto} from "../dtos/authentication/ForgotPassword/ForgotPasswordRequestDto";
import type {FogotPasswordResponseDto} from "../dtos/authentication/ForgotPassword/ForgotPasswordResponseDto";
import type {SignUpDTO} from "../dtos/authentication/SignUp/SignUpDTO";
import {storeAuthToken} from "../user_auth/user_auth";

export class AuthApi extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async loginUser(data: LoginRequestDto): Promise<any> {
        const result: any = await this.post(this.baseUrl + "/auth/login", data);
        storeAuthToken(result.token);
        return result;
    }

    async registerUser(data: SignUpDTO): Promise<{ user: any, token: any }> {
        const result = await this.post<{ user: any, token: any }>(this.baseUrl + "/auth/register/doctor", data);
        storeAuthToken(result.token);
        return result;
    }
    
    async registerPatient(data: SignUpDTO): Promise<{ user: any, token: any }> {
        const result = await this.post<{ user: any, token: any }>(this.baseUrl + "/auth/register/patient", data);
        return result;
    }
    
    


    async forgotPassword(data: ForgotPasswordRequestDto): Promise<FogotPasswordResponseDto> {
        return this.post<FogotPasswordResponseDto>(this.baseUrl + "/auth/forgot-password", data)
    }

}
