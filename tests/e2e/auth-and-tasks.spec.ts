import { test, expect } from "@playwright/test";

test.describe("Flujo principal: autenticación y tareas", () => {
  test("usuario no autenticado es redirigido al login al intentar acceder al dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
  });

  test("usuario puede loguearse y ver su dashboard", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel(/email/i).fill(process.env.E2E_TEST_EMAIL ?? "test@example.com");
    await page.getByLabel(/contraseña|password/i).fill(process.env.E2E_TEST_PASSWORD ?? "password123");
    await page.getByRole("button", { name: /iniciar sesión/i }).click();

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("usuario autenticado puede crear una tarea y verla en la lista", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel(/email/i).fill(process.env.E2E_TEST_EMAIL ?? "test@example.com");
    await page.getByLabel(/contraseña|password/i).fill(process.env.E2E_TEST_PASSWORD ?? "password123");
    await page.getByRole("button", { name: /iniciar sesión/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    const tituloTarea = `Tarea de prueba ${Date.now()}`;

    await page.getByPlaceholder("Nueva tarea...").fill(tituloTarea);
    await page.getByRole("button", { name: /agregar/i }).click();

    await expect(page.getByText(tituloTarea)).toBeVisible();
  });
});
