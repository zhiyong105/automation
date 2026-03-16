import { Page } from '@playwright/test';

export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

export function generateTestData(prefix: string = 'test') {
  const timestamp = Date.now();
  return {
    name: `${prefix}_${timestamp}`,
    email: `${prefix}_${timestamp}@example.com`,
    timestamp,
  };
}

export async function retryAction<T>(
  action: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await action();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('All retries failed');
}
