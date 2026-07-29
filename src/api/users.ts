
import type { User } from "../types/users";

const USERS_URL = "http://localhost:8080/api/v1/users";

export type CreateUserRequest = {
  username: string;
  email: string;
  phone_numbers: string[];
  };

export type UpdateUserRequest = {
  name: string;
  email: string;
};

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    return data.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
}

export async function createUser(
  request: CreateUserRequest,
): Promise<void> {
  // console.log("SENDING THIS JSON:", JSON.stringify(request));
  const response = await fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function updateUser(
  userID: number,
  request: UpdateUserRequest,
): Promise<void> {
  const response = await fetch(`${USERS_URL}/${userID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(USERS_URL);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<User[]>;
}
