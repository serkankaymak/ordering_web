import { TokenDto, UserModel } from "@/domain/UserModels";
import { LoginCommand, LoginRequest } from "../httpRequests/user/LoginRequest";
import { SigninCommand, SigninRequest } from "../httpRequests/user/SigninRequest";
import { ServiceResponse } from "./ServiceResponse";

export interface IUserService {
  SignIn(command: SigninCommand): Promise<ServiceResponse<UserModel>>;
  Login(command: LoginCommand): Promise<ServiceResponse<UserModel>>;
  Logout(): Promise<ServiceResponse<void>>;
  getCurrentUser(): UserModel | undefined;
}

export class UserService implements IUserService {
  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  constructor() { }

  // Storage'dan token bilgisini okuyarak UserModel oluşturur (geçerli ise)
  public getCurrentUser(): UserModel | undefined {
    const stored = localStorage.getItem('token');
    if (!stored) return undefined;
    try {
      const tokenDto = TokenDto.fromJson(JSON.parse(stored));
      const userModel = new UserModel({ token: tokenDto });
      return userModel;
    } catch (error) {
      console.error("Error parsing stored token:", error);
      localStorage.removeItem('token');
      return undefined;
    }
  }

  public async SignIn(command: SigninCommand): Promise<ServiceResponse<UserModel>> {
    const response = await SigninRequest.send(command);
    if (response.isSuccess) {
      localStorage.setItem('token', JSON.stringify(response.data));
      const token = TokenDto.fromJson(response.data!);
      const userModel = new UserModel({ token: token });
      return ServiceResponse.success(userModel);
    } else {
      return ServiceResponse.failure(response.error!);
    }
  }

  public async Login(command: LoginCommand): Promise<ServiceResponse<UserModel>> {
    const response = await LoginRequest.send(command);
    if (response.isSuccess) {
      localStorage.setItem('token', JSON.stringify(response.data));
      const token = TokenDto.fromJson(response.data!);
      const userModel = new UserModel({ token: token });
      return ServiceResponse.success(userModel);
    } else {
      return ServiceResponse.failure(response.error!);
    }
  }

  public async Logout(): Promise<ServiceResponse<void>> {
    localStorage.removeItem('token');
    return ServiceResponse.success(undefined);
  }
}
