import { User } from "../types/users";
import { apiClient } from "./api";
import { CreateUserRequest, UpdateUserRequest } from "./request.ts/UserRequest";

export class UsersClient {
  getAll(): Promise<User[]> {
    return apiClient.get<User[]>("/users");
  }

  getByID(userID: number): Promise<User> {
    return apiClient.get<User>(`/users/${userID}`);
  }

  create(request: CreateUserRequest): Promise<void> {
    return apiClient.post<void, CreateUserRequest>("/users", request);
  }

  update(userID: number, request: UpdateUserRequest): Promise<void> {
    return apiClient.put<void, UpdateUserRequest>(`/users/${userID}`, request);
  }

  delete(userID: number): Promise<void> {
    return apiClient.delete<void>(`/users/${userID}`);
  }
}

export const usersClient = new UsersClient();
