import { apiClient } from "../api";
import { LoginRequest, LoginResponse } from "../requests/Login";
import { ValidateResponse } from "../requests/validation";

export class AuthClient {
  login(request: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse, LoginRequest>("/auth/login", request);
  }

  validate(): Promise<ValidateResponse> {
    return apiClient.get<ValidateResponse>("/auth/validation");
  }
  logout(): Promise<void> {
    return apiClient.post<void>("/auth/logout");
  }
}

export const authClient = new AuthClient();
