import { test, expect, beforeEach, describe } from '@playwright/test';

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'lamine',
                name: 'lamine yamal',
                password: 'a123456'
            }
        })

        await page.goto('/')
    })
    test('Login form is shown', async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Log in to application')).toBeVisible()
    })
    describe('Login', () => {
        test('success with correct credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByLabel('username').fill('lamine')
            await page.getByLabel('password').fill('a123456')
            await page.getByRole('button', { name: 'Login' }).click()

            const exitDiv = page.locator('.success')
            await expect(exitDiv).toBeVisible()
        })
        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByLabel('username').fill('lamine')
            await page.getByLabel('password').fill('yamalcrack')
            await page.getByRole('button', { name: 'Login' }).click()

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('Invalid username or password')
        })
        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'login' }).click()
                await page.getByLabel('username').fill('lamine')
                await page.getByLabel('password').fill('a123456')
                await page.getByRole('button', { name: 'Login' }).click()
            })
            test('Blog can be created', async ({ page }) => {
                await page.getByRole('button', { name: 'create blog' }).click()
                await page.getByLabel('title:').fill('Skills 2 with LAMINE')
                await page.getByLabel('author:').fill('Lamine Yamal')
                await page.getByLabel('url:').fill('www.ytlamine.con')
                await page.getByRole('button', { name: 'Create' }).click()

                const successBlog = page.getByTestId('blog')
                await expect(successBlog.filter({ hasText: 'Skills 2 with LAMINE' })).toBeVisible()
            })
        })
    })
})