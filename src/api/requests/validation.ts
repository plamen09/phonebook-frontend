import { User } from "../../types/users";

export interface ValidateResponse {
  valid: boolean;
  user_id: number;
  user: User;
  is_admin: boolean;
}
