/**
 * @fileoverview
 *
 * ⚠️ Sensitive data and URLs are masked for portfolio use.
 */

const { test, expect } = require("@playwright/test");
require("dotenv").config();

// Global test timeout (30 min)
test.setTimeout(30 * 60 * 1000);

// =========================
// 🔐 LOGIN HELPER
// =========================
const login = async (page) => {
  await page.goto(process.env.APP_URL || "https://example-app/login");

  const user = process.env.APP_USER;
  const pass = process.env.APP_PASS;

  if (!user || !pass)
    throw new Error(
      "Missing credentials: Please define APP_USER and APP_PASS in .env"
    );

  await page.fill('input[placeholder="Email Address"]', user);
  await page.fill('input[placeholder="Password"]', pass);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  await handleTourGuide(page);
};

// =========================
// 🧭 OPTIONAL TOUR HANDLER
// =========================
const handleTourGuide = async (page) => {
  const tourPopup = page.locator(".reactour__popover");
  const isVisible = await tourPopup
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (!isVisible) return console.log("ℹ️ No tour popup detected.");

  console.log("🎯 Tour popup detected — handling...");
  const nextButton = tourPopup.getByRole("button", { name: "Next" });

  if (await nextButton.isVisible().catch(() => false)) {
    await nextButton.click();
  }

  const closeButton = page.locator("button.reactour__close-button");
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    await expect(tourPopup).toBeHidden({ timeout: 5000 });
    console.log("✅ Tour closed successfully.");
  }
};

// =========================
// 🧩 UTILITIES
// =========================
const generateRandomId = (prefix = "test-assistant") =>
  `${prefix}-${Math.random().toString(36).substring(2, 8)}`;

const navigateToAssistants = async (page) => {
  const assistantsLink = page.locator(
    'a[href="/assistants"] >> text=Assistants'
  );
  await expect(assistantsLink).toBeVisible({ timeout: 5000 });
  await assistantsLink.click();
  await handleTourGuide(page);
  console.log("✅ Navigated to Assistants section");
};

// =========================
// 🧪 TEST SUITE
// =========================
test.describe("Assistant Management Suite", () => {
  // -------------------------------------
  // Create + Delete Inbound Assistant
  // -------------------------------------
  test("Create and delete an Inbound Assistant", async ({ page }) => {
    await login(page);
    await navigateToAssistants(page);

    await page.getByRole("button", { name: "Add" }).click();
    await expect(
      page.getByRole("heading", { name: /Create New Assistant/i })
    ).toBeVisible();

    const uniqueId = generateRandomId();
    await page.getByPlaceholder("Enter Assistant's ID").fill(uniqueId);
    await page.getByRole("button", { name: "Create Assistant" }).click();

    // Wait until assistant card is visible
    const card = page.locator("div.agent-card", { hasText: uniqueId }).first();
    await expect(card).toBeVisible({ timeout: 15000 });
    console.log(`✅ Assistant created with ID: ${uniqueId}`);

    // Delete the assistant
    await card.locator("div.agent-actions button").first().click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    console.log("🗑️ Assistant deleted successfully");
  });

  // -------------------------------------
  // Prevent Duplicate Assistant IDs
  // -------------------------------------
  test("Prevent creation with duplicate Assistant ID", async ({ page }) => {
    await login(page);
    await navigateToAssistants(page);

    const uniqueId = generateRandomId("duplicate");

    // Create first assistant
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByPlaceholder("Enter Assistant's ID").fill(uniqueId);
    await page.getByRole("button", { name: "Create Assistant" }).click();
    await expect(
      page.getByRole("heading", { name: /Create New Assistant/i })
    ).toBeHidden();

    // Try creating a duplicate
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByPlaceholder("Enter Assistant's ID").fill(uniqueId);
    await page.getByRole("button", { name: "Create Assistant" }).click();

    // Validate error
    const errorMessage = page.locator(
      "text=/Assistant with this name already exists/i"
    );
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    console.log("✅ Duplicate ID validation works as expected");
  });

  // -------------------------------------
  // Validation for Empty Assistant ID
  // -------------------------------------
  test("Block creation with empty Assistant ID", async ({ page }) => {
    await login(page);
    await navigateToAssistants(page);

    await page.getByRole("button", { name: "Add" }).click();
    await page.getByPlaceholder("Enter Assistant's ID").fill("");
    await page.getByRole("button", { name: "Create Assistant" }).click();

    const validationMessage = page.locator("small.text-danger", {
      hasText: "Assistant ID is required.",
    });

    await expect(validationMessage).toBeVisible({ timeout: 3000 });
    console.log("✅ Required field validation displayed correctly");
  });

  // -------------------------------------
  // Edit Assistant Settings
  // -------------------------------------
  test("Edit Assistant Settings - Update ID", async ({ page }) => {
    await login(page);
    await navigateToAssistants(page);

    const cards = page.locator("div.agent-card");
    await expect(cards.first()).toBeVisible();

    const firstCard = cards.first();
    const settingsButton = firstCard.locator("button", { hasText: "Settings" });
    await settingsButton.click();

    const newId = `updated-${Math.floor(1000 + Math.random() * 9000)}`;
    const idInput = page.locator("input#agentName");

    await idInput.evaluate((input) => (input.value = ""));
    await idInput.type(newId);

    const saveButton = page.locator("button.btn-app", { hasText: "Save" });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    const toast = page.locator('div[role="alert"]', {
      hasText: /Assistant updated successfully/i,
    });
    await expect(toast).toBeVisible({ timeout: 10000 });
    console.log("✅ Assistant settings updated successfully");
  });

  // -------------------------------------
  // Verify Role Change Disabled (Read-only mode)
  // -------------------------------------
  test("Ensure role change option is disabled in settings", async ({
    page,
  }) => {
    await login(page);
    await navigateToAssistants(page);

    const cards = page.locator("div.agent-card");
    await expect(cards.first()).toBeVisible();

    const firstCard = cards.first();
    const settingsButton = firstCard.locator("button", { hasText: "Settings" });
    await settingsButton.click();

    const nextRoleButton = page.locator("button.next-btn.role-nav-btn");
    await expect(nextRoleButton).toBeDisabled();
    console.log("✅ Role change correctly disabled in edit mode");
  });
});
