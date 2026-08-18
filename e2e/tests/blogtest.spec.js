import { test, expect, beforeEach, describe } from '@playwright/test';
import { loginHelper, createHelper } from './helper';
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
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'pablogavi',
                name: 'pablo gavira',
                password: 'a12345'
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
            await loginHelper(page, 'lamine', 'a123456')

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
            describe('Edit blog', () => {
                beforeEach(async ({ page }) => {
                    await createHelper(page, 'fsdfsadfadfa', 'lamine yamal', 'www.lyen.com')
                })
                test('Can up likes', async ({ page }) => {
                    const successBlog = page.getByTestId('blog')
                    await successBlog.getByRole('button', { name: 'view' }).click()

                    const likeCounter = successBlog.getByTestId('likes')
                    const likesAntes = await likeCounter.textContent()
                    await successBlog.getByRole('button', { name: 'like' }).click()
                    const likesDespues = await likeCounter.textContent()

                    await expect(likeCounter).toHaveText('1 like')
                })
                test('Can Delete blog window dialog...', async ({ page }) => {
                    const openBlog = page.getByTestId('blog')
                    await openBlog.getByRole('button', { name: 'view' }).click()

                    page.on('dialog', async dialog => {
                        await dialog.accept()
                    })
                    await page.getByRole('button', { name: 'Remove' }).click()
                    await expect(openBlog).not.toBeVisible()
                })
                describe('Second account', () => {
                    beforeEach(async ({ page }) => {
                        await page.getByRole('button', { name: 'logout' }).click()
                        await loginHelper(page, 'pablogavi', 'a12345')
                    })
                    test('Only creator show Remove Button Blog', async ({ page }) => {
                        await page.getByRole('button', { name: 'view' }).click()
                        await expect(page.getByText('Remove')).not.toBeVisible()
                    })
                })
            })
        })
    })
})