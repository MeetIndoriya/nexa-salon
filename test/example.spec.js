import { test, expect } from '@playwright/test';

test('NexaSalon Login Test', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.locator('#btn-login').click()
  await page.getByPlaceholder('Email Address').fill('admin@salon.com')
  await page.getByPlaceholder('Password').fill('admin123')
  await page.locator('#btn-login').click()
  await page.waitForURL('http://localhost:5173/dashboard/admin')
});

