import { APIRequestContext } from "@playwright/test";
import Logger from "./LoggerUtil";

export interface APIRequestOptions {
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, string | number>;
  timeout?: number;
}

export interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  text: string;
  isOk: boolean;
}

export default class APIClient {
  private request: APIRequestContext;
  private logger: Logger;
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  constructor(
    request: APIRequestContext,
    logger: Logger,
    baseUrl: string = "",
  ) {
    this.request = request;
    this.logger = logger;
    this.baseUrl = baseUrl;
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
    this.logger.info("✓ Authorization token set");
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
    this.logger.info(`✓ Header set: ${key}`);
  }

  /**
   * GET request
   */
  async get(
    endpoint: string,
    options?: APIRequestOptions,
  ): Promise<APIResponse> {
    return this.makeRequest("GET", endpoint, options);
  }

  /**
   * POST request
   */
  async post(
    endpoint: string,
    options?: APIRequestOptions,
  ): Promise<APIResponse> {
    return this.makeRequest("POST", endpoint, options);
  }

  /**
   * PUT request
   */
  async put(
    endpoint: string,
    options?: APIRequestOptions,
  ): Promise<APIResponse> {
    return this.makeRequest("PUT", endpoint, options);
  }

  /**
   * PATCH request
   */
  async patch(
    endpoint: string,
    options?: APIRequestOptions,
  ): Promise<APIResponse> {
    return this.makeRequest("PATCH", endpoint, options);
  }

  /**
   * DELETE request
   */
  async delete(
    endpoint: string,
    options?: APIRequestOptions,
  ): Promise<APIResponse> {
    return this.makeRequest("DELETE", endpoint, options);
  }

  /**
   * HEAD request
   */
  async head(
    endpoint: string,
    options?: APIRequestOptions,
  ): Promise<APIResponse> {
    return this.makeRequest("HEAD", endpoint, options);
  }

  /**
   * Generic request method
   */
  private async makeRequest(
    method: string,
    endpoint: string,
    options?: APIRequestOptions,
  ): Promise<APIResponse> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const headers = { ...this.defaultHeaders, ...options?.headers };

      this.logger.info(`→ ${method} ${url}`);

      const requestOptions: any = { headers };
      if (options?.data && ["POST", "PUT", "PATCH"].includes(method)) {
        requestOptions.data = options.data;
        this.logger.debug(`Request body: ${JSON.stringify(options.data)}`);
      }
      if (options?.timeout) {
        requestOptions.timeout = options.timeout;
      }

      const response = await this.request.fetch(url, {
        method,
        ...requestOptions,
      });

      const body = await this.parseResponse(response);

      const headerArray = response.headersArray() || [];
      const headersObj: Record<string, string> = {};
      headerArray.forEach((h: any) => {
        headersObj[h.name] = h.value;
      });

      const apiResponse: APIResponse = {
        status: response.status(),
        statusText: response.statusText(),
        headers: headersObj,
        body,
        text: typeof body === "string" ? body : JSON.stringify(body),
        isOk: response.ok(),
      };

      this.logResponse(apiResponse);
      return apiResponse;
    } catch (error) {
      this.logger.error(`✗ API request failed: ${error}`);
      throw error;
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number>,
  ): string {
    let url = endpoint.startsWith("http") ? endpoint : this.baseUrl + endpoint;

    if (params) {
      const queryString = new URLSearchParams(
        params as Record<string, string>,
      ).toString();
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Parse response body
   */
  private async parseResponse(response: any): Promise<any> {
    try {
      const contentType = response.headers()?.["content-type"] || "";

      if (contentType.includes("application/json")) {
        return await response.json();
      } else if (contentType.includes("text")) {
        return await response.text();
      } else {
        return await response.text();
      }
    } catch {
      return await response.text();
    }
  }

  /**
   * Log API response
   */
  private logResponse(response: APIResponse): void {
    const statusEmoji =
      response.status >= 200 && response.status < 300 ? "✓" : "✗";
    this.logger.info(
      `${statusEmoji} Response: ${response.status} ${response.statusText}`,
    );

    if (response.status >= 400) {
      this.logger.error(`Response body: ${response.text}`);
    }
  }

  /**
   * Assert response status
   */
  async assertStatusCode(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    if (response.status !== expectedStatus) {
      this.logger.error(
        `✗ Expected status ${expectedStatus}, got ${response.status}`,
      );
      throw new Error(
        `Status code mismatch: expected ${expectedStatus}, got ${response.status}`,
      );
    }
    this.logger.info(`✓ Status code: ${expectedStatus}`);
  }

  /**
   * Assert response contains key
   */
  async assertResponseContainsKey(
    response: APIResponse,
    key: string,
  ): Promise<void> {
    if (
      typeof response.body === "object" &&
      response.body !== null &&
      !(key in response.body)
    ) {
      this.logger.error(`✗ Response does not contain key: ${key}`);
      throw new Error(`Response missing key: ${key}`);
    }
    this.logger.info(`✓ Response contains key: ${key}`);
  }

  /**
   * Assert response value
   */
  async assertResponseValue(
    response: APIResponse,
    key: string,
    expectedValue: any,
  ): Promise<void> {
    const actualValue = response.body[key];
    if (actualValue !== expectedValue) {
      this.logger.error(
        `✗ Expected ${key}=${expectedValue}, got ${actualValue}`,
      );
      throw new Error(
        `Response value mismatch: expected ${key}=${expectedValue}, got ${actualValue}`,
      );
    }
    this.logger.info(`✓ ${key} = ${expectedValue}`);
  }
}
