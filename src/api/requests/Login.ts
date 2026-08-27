import { User } from "../../types/users";

export type LoginRequest = {
  email: string;
  password: string;
};
export interface LoginResponse {
  message: string;
  user: User;
}
