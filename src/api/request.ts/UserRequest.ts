import { Phone } from "../../types/phone";

export type CreateUserRequest = {
  username: string;
  email: string;
  phone_numbers: string[];
  };

export type UpdateUserRequest = {
  name: string;
  email: string;
};
export type EditUserRequest = {
  name: string;
  email: string;
  phonenumber: Phone;
};