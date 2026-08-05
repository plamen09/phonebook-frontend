import { ApiClient } from "./ApiClient";

const apiURL = import.meta.env.VITE_API_URL;

if (!apiURL) {
  throw new Error("VITE_API_URL is not configured");
}

export const apiClient = new ApiClient(apiURL);
