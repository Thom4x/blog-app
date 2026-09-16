import { test, expect, beforeEach, describe } from "@playwright/test";
import { loginHelper, createHelper } from "./helper";
describe("Blog Detail", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "lamine",
        name: "lamine yamal",
        password: "a123456",
      },
    });
    await page.goto("/");
  });
  test("El inicio de sesión se realizó correctamente con la combinación correcta de nombre de usuario y contraseña", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "login" }).click();

    await loginHelper(page, "lamine", "a123456");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("lamine logged in")).toBeVisible();
  });
  test("El inicio de sesión falla si el nombre de usuario/contraseña es incorrecto", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "login" }).click();

    await loginHelper(page, "lamine", "alamine");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid username or password")).toBeVisible();
  });
  describe("Usuario con sesion iniciada", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await loginHelper(page, "lamine", "a123456");
    });
    test("Un usuario que haya iniciado sesión puede crear un blog.", async ({
      page,
    }) => {
      await page.getByRole("link", { name: "new blog" }).click();
      await createHelper(
        page,
        "los bandidos",
        "lamine tamal",
        "www.gorras.com",
      );
      await expect(page.getByText("los bandidos - lamine tamal")).toBeVisible();
    });
    describe("Edicion de un blog", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("link", { name: "new blog" }).click();
        await createHelper(
          page,
          "los bandidos",
          "lamine tamal",
          "www.gorras.com",
        );
      });
      test("A un usuario que haya iniciado sesión le pueden gustar los blogs.", async ({
        page,
      }) => {
        await page
          .getByRole("link", { name: "los bandidos - lamine tamal" })
          .click();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("Up!")).toBeVisible();
      });
      test("Un usuario que haya iniciado sesión puede eliminar un blog.", async ({
        page,
      }) => {
        await page
          .getByRole("link", { name: "los bandidos - lamine tamal" })
          .click();

        page.on("dialog", async (dialog) => {
          await dialog.accept();
        });
        await page.getByRole("button", { name: "remove" }).click();
        await expect(page.getByText("Has eliminado el blog")).toBeVisible();
      });
    });
  });
});
