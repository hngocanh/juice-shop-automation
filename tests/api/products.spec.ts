import { test, expect } from '@playwright/test';

interface ProductsPayload {
  status: string;
  data: Array<Record<string, unknown>>;
}

test.describe('Products API', () => {
  // Validates that the public product catalog endpoint is available for browsing (HTTP contract).
  test('GET /api/Products responds with HTTP 200', async ({ request }) => {
    const response = await request.get('/api/Products');

    expect(response.status()).toBe(200);
  });

  // Validates that the shop exposes at least one sellable item (non-empty catalog business rule).
  test('GET /api/Products returns a non-empty data array', async ({ request }) => {
    const response = await request.get('/api/Products');

    const body = (await response.json()) as ProductsPayload;

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  // Validates minimum product fields required for display and pricing on the storefront.
  test('each product exposes id, name, and price', async ({ request }) => {
    const response = await request.get('/api/Products');

    const body = (await response.json()) as ProductsPayload;

    for (const product of body.data) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
    }
  });
});
