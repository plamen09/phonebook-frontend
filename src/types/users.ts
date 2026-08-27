import { Phone } from "./phone";

export interface User {
  Name: string;
  ID: number;
  Email: string;
  phonenumber: Phone[];
  password: string;
  is_admin: boolean;
}
