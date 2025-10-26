/**
 * @fileoverview
 * Playwright E2E Test Suite — ⚙️ Settings & Billing Module
 *
 *
 */

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { setPassword } from "../custom-playwright-utils/credentialStore";
import { updateEnvPassword } from "../custom-playwright-utils/updateEnv";
dotenv.config();

// -----------------------------------------------------------------------------
// ⚙️ Configuration
// -----------------------------------------------------------------------------
test.setTimeout(300 * 60 * 1000); // 5 hours (long UI sessions)

const APP_URL =
  process.env.APP_URL || "https://convoa-1.taild6271e.ts.net/login";
const APP_USER = process.env.APP_USER || "testerdrew7@yopmail.com";
const APP_PASS = process.env.APP_PASS || "Test12345@";

if (!APP_USER || !APP_PASS) {
  throw new Error(
    "❌ APP_USER or APP_PASS not defined in environment variables."
  );
}

// -----------------------------------------------------------------------------
// 🔑 Utility: Secure Random Password Generator
// -----------------------------------------------------------------------------
function generatePassword(length = 10) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const specials = "@#$%^&*";
  const allChars = letters + digits + specials;

  // Ensure at least one char of each type
  let password =
    letters[Math.floor(Math.random() * letters.length)] +
    digits[Math.floor(Math.random() * digits.length)] +
    specials[Math.floor(Math.random() * specials.length)];

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle and return
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

// -----------------------------------------------------------------------------
// 🎯 Background Popup Killer — Handles Guided Tours
// -----------------------------------------------------------------------------
function handleTourGuide(page) {
  const checkAndClosePopup = async () => {
    try {
      const popup = page.locator(".reactour__popover");
      if (await popup.isVisible({ timeout: 100 }).catch(() => false)) {
        const closeBtn = popup.locator(".reactour__close-button");
        if (await closeBtn.isVisible().catch(() => false)) {
          console.log("❌ Tour popup detected — closing...");
          await closeBtn.click({ timeout: 2000 }).catch(() => {});
          await popup
            .waitFor({ state: "hidden", timeout: 2000 })
            .catch(() => {});
        }
      }
    } catch {
      // Ignore transient navigation or frame detachment
    }
  };

  const interval = setInterval(checkAndClosePopup, 500);
  page.context().once("close", () => clearInterval(interval));
}

// -----------------------------------------------------------------------------
// 🔐 Login Function — Auth + Tour Bypass
// -----------------------------------------------------------------------------
async function login(page) {
  console.log("🔐 Navigating to login...");
  await page.goto(APP_URL, { waitUntil: "domcontentloaded", timeout: 180000 });

  await page.fill('input[placeholder="Email Address"]', APP_USER);
  await page.fill('input[placeholder="Password"]', APP_PASS);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 70000 });
  console.log("✅ Logged in successfully. Dashboard visible.");
}

// -----------------------------------------------------------------------------
// ⚙️ Utility: Navigate to Settings Dropdown
// -----------------------------------------------------------------------------
async function openSettingsDropdown(page) {
  const dropdown = page.getByRole("button", { name: "Open dropdown" });
  await expect(dropdown).toBeVisible({ timeout: 10000 });
  await dropdown.click();
  console.log("📂 Settings dropdown opened successfully.");
}

// -----------------------------------------------------------------------------
// 🧠 Global Hook: Run Popup Handler for All Tests
// -----------------------------------------------------------------------------
test.beforeEach(async ({ page }) => {
  handleTourGuide(page);
});

// -----------------------------------------------------------------------------
// 🧪 TEST SUITE — Settings Screen Validation
// -----------------------------------------------------------------------------
test.describe("⚙️ Settings & Billing E2E Suite", () => {
  // ---------------------------------------------------------------------------
  test("💳 Validate Payment & Billing Settings", async ({ page }) => {
    await login(page);
    await openSettingsDropdown(page);

    const paymentLink = page.locator(
      'a.dropdown-item[href="/payment"][data-discover="true"]'
    );
    await expect(paymentLink).toBeVisible();
    await paymentLink.click();

    console.log("🔍 Validating payment dashboard...");
    await expect(page.locator("h2.text-white.fw-bold.mb-0")).toHaveText(
      "Payments"
    );
    await expect(
      page.locator("h6", { hasText: "Usage Statistics" })
    ).toBeVisible();

    const cards = [
      "Assistant Usage",
      "Minutes Usage",
      "Calls Usage",
      "Price Plan",
      "Subscription Status",
      "Period End",
    ];
    for (const card of cards) {
      await expect(page.locator(`div.card:has-text("${card}")`)).toBeVisible();
    }
    console.log("✅ All billing summary cards verified.");

    const updateBtn = page.locator("button.btn-billing-consumption", {
      hasText: "Update Subscription",
    });

    console.log("🔗 Testing external Stripe billing redirection...");
    const [newPage] = await Promise.all([
      page.context().waitForEvent("page"),
      updateBtn.click(),
    ]);
    await newPage.waitForLoadState("load");
    expect(newPage.url()).toContain("billing.stripe");
    console.log("✅ Stripe billing page loaded successfully.");
    await newPage.close();
  });

  // ---------------------------------------------------------------------------
  test("👤 Validate User Profile Settings", async ({ page }) => {
    await login(page);
    await openSettingsDropdown(page);
    await page.locator('a.dropdown-item[href="/settings"]').click();

    console.log("🧾 Updating user profile name...");
    const nameInput = page.locator('input[name="name"]');
    const updatedName = `updated_${Math.random().toString(36).substring(2, 8)}`;
    await nameInput.fill(updatedName);
    await page.getByRole("button", { name: "Update Name" }).click();
    await expect(nameInput).toHaveValue(updatedName);
    console.log("✅ Profile name updated successfully.");

    const emailInput = page.locator('input[name="email"]');
    expect(await emailInput.isDisabled()).toBe(true);
    console.log("✅ Email input is locked (read-only).");
  });

  // ---------------------------------------------------------------------------
  test("🔒 Validate Change Password Flow", async ({ page }) => {
    await login(page);
    await openSettingsDropdown(page);
    await page.locator('a.dropdown-item[href="/settings"]').click();

    await expect(
      page.getByRole("heading", { name: "Change Password" })
    ).toBeVisible();
    console.log("🧩 Password change section visible.");

    // Password rotation logic

    const currPassword = process.env.APP_PASS;
    const newPassword =
      currPassword === "Test12345@"
        ? "Test12345@@"
        : currPassword === "Test12345@@"
        ? "Test12345@"
        : generatePassword();

    await page.fill('input[name="old_password"]', currPassword);
    await page.fill('input[name="new_password"]', newPassword);
    await page.fill('input[name="confirm_password"]', newPassword);
    await page.getByRole("button", { name: "Change Password" }).click();

    await expect(
      page.locator("text=Password changed successfully")
    ).toBeVisible();
    setPassword(newPassword);
    updateEnvPassword(newPassword);
    console.log(`🔐 Password rotated successfully → ${newPassword}`);
  });

  // ---------------------------------------------------------------------------
  test("❓ Validate Help Center Link", async ({ page }) => {
    await login(page);
    await openSettingsDropdown(page);

    const helpLink = page.locator("a.dropdown-item", {
      hasText: "Help Center",
    });
    await expect(helpLink).toBeVisible();

    console.log("🔗 Opening Help Center...");
    const [newPage] = await Promise.all([
      page.context().waitForEvent("page"),
      helpLink.click(),
    ]);
    await newPage.waitForLoadState("load");

    expect(newPage.url()).toContain("docs.convoa.ai");
    console.log("✅ Help Center loaded successfully.");
    await newPage.close();
  });
});
