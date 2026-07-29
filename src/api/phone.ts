export type CreatePhoneRequest = {
  user_id: number;
  number: string;
};

type Phone = {
  ID: number;
  UserID: number;
  Number: string;
};

type CreatePhoneResponse = {
  message: string;
  phone: Phone;
};

const API_URL = "http://localhost:8080/api/v1";

export async function createPhone(
  request: CreatePhoneRequest,
): Promise<Phone> {
  const response = await fetch(`${API_URL}/phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to create phone");
  }

  const data = (await response.json()) as CreatePhoneResponse;

  return data.phone;
}

export async function getPhones(): Promise<Phone[]> {
  const response = await fetch(`${API_URL}/phones`);

  if (!response.ok) {
    throw new Error("Failed to load phones");
  }

  const data = (await response.json()) as {
    phones: Phone[];
  };

  return data.phones;
}

export async function deletePhone(phoneID: number): Promise<void> {
  const response = await fetch(
    `${API_URL}/phone/${phoneID}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to delete phone");
  }
}