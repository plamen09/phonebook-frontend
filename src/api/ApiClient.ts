import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    if (!baseURL) {
      throw new Error("API base URL is required");
    }

    this.client = axios.create({
      baseURL,
      timeout: 10_000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);

    return response.data;
  }

  async post<TResponse, TRequest>(
    url: string,
    request: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await this.client.post(
      url,
      request,
      config,
    );

    return response.data;
  }

  async put<TResponse, TRequest>(
    url: string,
    request: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await this.client.put(
      url,
      request,
      config,
    );

    return response.data;
  }

  async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);

    return response.data;
  }
}
