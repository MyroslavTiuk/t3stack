import { test, expect } from "@playwright/test";

test("scanner", async ({ page }) => {
  await page.goto("/");

  const viewportWidth = page.viewportSize()?.width;
  if (viewportWidth && viewportWidth < 768) {
    const hamburgerButton = await page.getByRole("button", {
      name: "Open/Close Menu",
    });
    await hamburgerButton.click();
  }

  await page.getByText("Option Scanner").click();

  await expect(
    page.getByRole("heading", { name: "Cash Secured Put Scanner" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "The cash secured put strategy has a setup of selling 1 put contract, typically"
    )
  ).toBeVisible();

  await page.getByTestId("scanner-select").selectOption("short-call-spread");
  await expect(
    page.getByRole("heading", { name: "Short Call Spread Scanner" })
  ).toBeVisible();

  await page.getByRole("button", { name: "SCAN OPTIONS" }).click();
  await page.getByRole("button", { name: "Run Scan" }).click();
  await expect(page.getByRole("cell", { name: "Name" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Stock price" })).toBeVisible();
});
