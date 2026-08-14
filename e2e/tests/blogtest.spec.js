import { test, expect, beforeEach, describe } from '@playwright/test';

describe('Blog App', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })
    test('Login form visible', async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Log in to application')).toBeVisible()
    })
})