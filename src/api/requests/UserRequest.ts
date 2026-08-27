import { Phone } from "../../types/phone";

export type CreateUserRequest = {
  username: string;
  email: string;
  phone_numbers: string[];
  password: string;
  is_admin: boolean;
  };

export type UpdateUserRequest = {
  name: string;
  email: string;
};
export type EditUserRequest = {
  name: string;
  email: string;
  phonenumber: Phone;
  is_admin: boolean;
};

