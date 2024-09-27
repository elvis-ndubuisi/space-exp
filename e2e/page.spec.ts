import { test, expect } from "@playwright/test";

test.describe("SpaceX Launches App", () => {
  test("should display the launch list and navigate to launch details", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    await expect(page).toHaveTitle("SpaceX Launches");

    const heading = page.locator('h1:has-text("Upcoming SpaceX Launches")');
    await expect(heading).toBeVisible();

    const searchInput = page.locator(
      'input[placeholder="Search all columns..."]'
    );
    await expect(searchInput).toBeVisible();
    const tableRows = page.locator("tbody tr");
    await expect(tableRows.first()).toBeVisible();

    await page.click("tbody tr:first-child a");

    await expect(page).toHaveURL(/\/[a-zA-Z0-9]+$/);

    const missionName = page.locator("h1");
    await expect(missionName).toBeVisible();

    const launchDetails = page.locator("text=Launch Details");
    await expect(launchDetails).toBeVisible();

    const rocketInfo = page.locator("text=Rocket:");
    await expect(rocketInfo).toBeVisible();

    const launchSite = page.locator("text=Launch Site:");
    await expect(launchSite).toBeVisible();

    const backButton = page.locator("text=Back to Launches");
    await expect(backButton).toBeVisible();

    await backButton.click();

    await expect(page).toHaveURL("http://localhost:3000");
  });

  test("should filter launches based on search input", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const initialRowCount = await page.locator("tbody tr").count();

    await page.fill('input[placeholder="Search all columns..."]', "Falcon");

    await page.waitForTimeout(500);

    const filteredRowCount = await page.locator("tbody tr").count();

    expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);

    const visibleRows = page.locator("tbody tr:visible");
    await expect(visibleRows).toHaveCount(filteredRowCount);
    for (let i = 0; i < filteredRowCount; i++) {
      const rowText = await visibleRows.nth(i).innerText();
      expect(rowText.toLowerCase()).toContain("falcon");
    }
  });
});
