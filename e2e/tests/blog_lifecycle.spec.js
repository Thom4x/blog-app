import { test, expect, beforeEach, describe } from "@playwright/test";
import { loginHelper, createHelper } from "./e2e_helpers";
describe("Blog App", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        username: "lamine",
        name: "lamine yamal",
        password: "a123456",
      },
    });
    await request.post("/api/users", {
      data: {
        username: "pablogavi",
        name: "pablo gavira",
        password: "a12345",
      },
    });

    await page.goto("/");
  });
  test("Login form is shown", async ({ page }) => {
    await page.getByRole("link", { name: "login" }).click();
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("Log in to application")).toBeVisible();
  });
  describe("Login", () => {
    test("success with correct credentials", async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await loginHelper(page, "lamine", "a123456");

      await expect(page.getByText("Welcome lamine")).toBeVisible();
    });
    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await loginHelper(page, "lamine", "yamalcrack");

      await expect(page.getByText("Username o password incorrectos")).toBeVisible();
    });
    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("link", { name: "login" }).click();
        await loginHelper(page, "lamine", "a123456");
        await expect(page.getByText("Welcome lamine")).toBeVisible();
      });
      test("Blog can be created", async ({ page }) => {
        await page.getByRole('link', { name: 'new blog' }).click();
        await page.getByLabel("title:").fill("Skills 2 with LAMINE");
        await page.getByLabel("author:").fill("Lamine Yamal");
        await page.getByLabel("url:").fill("www.ytlamine.con");
        await page.getByRole("button", { name: "Create" }).click();

        const successBlog = page.getByTestId("blog");
        await expect(
          successBlog.filter({ hasText: "Skills 2 with LAMINE" }),
        ).toBeVisible();
      });
      describe("Edit blog", () => {
        beforeEach(async ({ page }) => {
          await createHelper(
            page,
            "test blog",
            "lamine yamal",
            "www.test.com",
          );
          await expect(page.getByText("test blog - lamine yamal")).toBeVisible();

          await createHelper(
            page,
            "test blog 2",
            "lamine yamal",
            "www.test.com",
          );
          await expect(page.getByText("test blog 2 - lamine yamal")).toBeVisible();

        });
        test("Can up likes", async ({ page }) => {
          const successBlog = page.getByTestId("blog");
          await page.getByRole('link', { name: 'test blog - lamine yamal' }).click();

          await Promise.all([
            page.waitForResponse(
              (response) =>
                response.request().method() === "PUT" &&
                response.url().includes("/api/blogs/"),
            ),
            page.getByTestId("like-button").click(),
          ]);
          await expect(page.getByText(/Blog liked successfully:/)).toBeVisible();
        });
        test("Can Delete blog window dialog...", async ({ page }) => {
          const openBlog = page.getByTestId("blog");
          await openBlog.getByRole('link', { name: 'test blog - lamine yamal' }).click();

          page.on("dialog", async (dialog) => {
            await dialog.accept();
          });
          await page.getByTestId('remove-button').click();
          await expect(openBlog.getByText("test blog - lamine yamal")).not.toBeVisible();
        });
        describe("Second account", () => {
          beforeEach(async ({ page }) => {
            await page.getByRole("link", { name: "logout" }).click();
            await page.getByRole("link", { name: "login" }).click();
            await loginHelper(page, "pablogavi", "a12345");
            await expect(page.getByRole("link", { name: "logout" })).toBeVisible();
          });
          test("Only creator show Remove Button Blog", async ({ page }) => {
            await page.getByRole('link', { name: 'test blog 2 - lamine yamal' }).click();
            await expect(page.getByText("Remove")).not.toBeVisible();
          });
        });
      });
    });
  });
});
