import type { APIRequestContext, APIResponse } from '@playwright/test';

interface LoginSuccessBody {
  authentication: {
    token: string;
  };
}

export class ApiHelper {
  constructor(private readonly request: APIRequestContext) {}

  async getAuthToken(email: string, password: string): Promise<string> {
    const response = await this.request.post('/rest/user/login', {
      data: { email, password },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok()) {
      throw new Error(`Login failed with status ${response.status()}: ${await response.text()}`);
    }

    const body = (await response.json()) as LoginSuccessBody;
    return body.authentication.token;
  }

  async getProducts(): Promise<APIResponse> {
    return this.request.get('/api/Products');
  }
}
