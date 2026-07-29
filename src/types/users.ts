import { Phone } from "./phone";



export type User = {
  Phone: string;
  Name: string;
  ID: number;
  Email: string;
  phonenumber: Phone[];
};

export type CreateUserRequest = {
  username: string;
  email: string;
  phonenumbers: string[];
};

export type EditUserRequest = {
  name: string;
  email: string;
  phonenumber: Phone;
};
