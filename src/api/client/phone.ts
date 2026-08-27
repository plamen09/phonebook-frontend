import { Phone } from "../../types/phone";
import { apiClient } from "../api";
import {
  CreatePhoneRequest,
  UpdatePhoneRequest,
} from "../requests/PhoneRequest";

export class PhonesClient {
  getAll(): Promise<Phone[]> {
    return apiClient.get<Phone[]>("/phones");
  }

  create(request: CreatePhoneRequest): Promise<void> {
    return apiClient.post<void, CreatePhoneRequest>("/phones", request);
  }

  update(phoneID: number, request: UpdatePhoneRequest): Promise<void> {
    return apiClient.put<void, UpdatePhoneRequest>(
      `/phones/${phoneID}`,
      request,
    );
  }

  delete(phoneID: number): Promise<void> {
    return apiClient.delete<void>(`/phones/${phoneID}`);
  }
}

export const phonesClient = new PhonesClient();
