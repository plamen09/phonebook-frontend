import { Key } from "react";
import { JSX } from "react/jsx-runtime";

export type Phone = {
  length: number;
  ID: number;
  user_id: number;
  number: string;
};
export type CreatePhoneRequest = {
  user_id: number;
  number: string;
};
