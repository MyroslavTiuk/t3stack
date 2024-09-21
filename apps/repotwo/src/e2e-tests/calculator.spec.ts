import { test, expect } from "@playwright/test";

test("calculator", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Option Profit Calculator/);
  await page.getByLabel("Choose a Strategy to get Started").click();
  await page
    .getByRole("combobox", { name: "Choose a Strategy to get Started" })
    .fill("covered call");
  await page.getByRole("option", { name: "Covered Call", exact: true }).click();
  await page.getByLabel("Select Underlying Stock Symbol...").click();
  await page
    .getByRole("combobox", { name: "Select Underlying Stock Symbol..." })
    .fill("AAL");
  await page
    .getByRole("option", {
      name: "American Airlines Group, Inc. - Common Stock (AAL)",
    })
    .click();
  await page
    .getByRole("button", { name: /[0-9][0-9]/ })
    .first()
    .click();
  await page.getByRole("button", { name: "Select from Option Chain" }).click();
  await page.getByRole("cell", { name: /CALL/ }).first().click();

  await expect(page.getByText("Max Profit")).toBeVisible();
  await expect(page.getByText("Max Loss")).toBeVisible();
  await expect(page.getByText(/Profit\/Loss on/)).toBeVisible();
});
