
import { Phone } from "../types/phone";
import { apiClient } from "./api";
import { CreatePhoneRequest, UpdatePhoneRequest } from "./request.ts/PhoneRequest";

type NewType = { message: string; phone: Phone };

type CreatePhoneResponse = NewType;

export class PhonesClient {
  getAll(): Promise<Phone[]> {
    return apiClient.get<Phone[]>("/phones");
  }

  getByID(phoneID: number): Promise<Phone> {
    return apiClient.get<Phone>(`/phones/${phoneID}`);
  }

  getByUserID(userID: number): Promise<Phone[]> {
    return apiClient.get<Phone[]>("/phones", {
      params: {
        user_id: userID,
      },
    });
  }

  create(request: CreatePhoneRequest): Promise<void> {
    return apiClient.post<void, CreatePhoneRequest>("/phone", request);
  }

  update(phoneID: number, request: UpdatePhoneRequest): Promise<void> {
    return apiClient.put<void, UpdatePhoneRequest>(
      `/phone/${phoneID}`,
      request,
    );
  }

  delete(phoneID: number): Promise<void> {
    return apiClient.delete<void>(`/phone/${phoneID}`);
  }
}

export const phonesClient = new PhonesClient();
