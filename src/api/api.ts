

import { ApiClient } from "./ApiClient";

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL ??
    "http://localhost:8080/api/v1",
);