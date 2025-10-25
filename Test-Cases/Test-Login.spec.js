/**
 * @fileoverview
 * Playwright E2E test suite for the Login Module.
 *
 * Includes:
 *  ✅ Valid login and logout flow
 *  ✅ Remember-me session persistence
 *  ✅ Negative tests (invalid email, invalid password)
 *  ✅ Input validation checks
 *  ✅ Continuous popup handler for guided tours
 *
 * Environment variables (in .env):
 *  - APP_URL     = https://example-app.com/login
 *  - APP_USER    = user@example.com
 *  - APP_PASS    = StrongPassword123!
 */

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe.configure({ timeout: 120000 });

// =========================
// 🧠 Background Tour Popup Handler
// =========================
const handleTourGuide = (page) => {
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
      // ignore transient frame/navigation errors
    }
  };

  const intervalId = setInterval(checkAndClosePopup, 500);
  page.context().once("close", () => clearInterval(intervalId));
};

// =========================
// 🧪 Test Suite: Login Module
// =========================
test.describe("Login Module", () => {
  const validEmail = process.env.APP_USER || "demo@example.com";
  const validPassword = process.env.APP_PASS || "Demo@1234";
  const invalidPassword = "wrongPass123!";
  const invalidEmail = "notfound@example.com";
  const appUrl = process.env.APP_URL || "https://example-app.com/login";

  // Common setup — load login page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto(appUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
  });

  // ======================================
  // ✅ TC1: Valid Login → Guided Tour → Logout
  // ======================================
  test("should login successfully, handle guided tour, and logout", async ({
    page,
  }) => {
    await page.getByPlaceholder("Email Address").fill(validEmail);
    await page.waitForTimeout(300);
    await page.getByPlaceholder("Password").fill(validPassword);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });
    handleTourGuide(page);

    // Logout process
    const dropdownToggle = page.locator(
      'button.bg-transparent.border-0 >> img[alt="Open dropdown"]'
    );
    await expect(dropdownToggle).toBeVisible({ timeout: 5000 });
    await dropdownToggle.click();

    const logoutLink = page.locator('a.dropdown-item:has-text("Log Out")');
    await expect(logoutLink).toBeVisible({ timeout: 5000 });
    await logoutLink.click();

    const confirmLogoutButton = page.locator(
      'button.btn-warning-amber:text-is("Log Out")'
    );
    await expect(confirmLogoutButton).toBeVisible({ timeout: 5000 });
    await confirmLogoutButton.click();

    await expect(page).toHaveURL(/\/login$/, { timeout: 50000 });
    console.log("🚪 Successfully logged out.");
  });

  // ======================================
  // ✅ TC2: Remember Me — Persistent Login
  // ======================================
  test('should stay logged in when "Remember me" is checked', async ({
    page,
    context,
  }) => {
    await page.getByPlaceholder("Email Address").fill(validEmail);
    await page.getByPlaceholder("Password").fill(validPassword);
    await page.locator("#rememberMe").check();
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });

    // simulate new session
    const newContext = await context
      .browser()
      .newContext({ storageState: await context.storageState() });
    const newPage = await newContext.newPage();
    await newPage.goto(
      `${process.env.APP_URL?.replace("/login", "")}/dashboard`
    );
    await expect(newPage).toHaveURL(/dashboard/);
    console.log("🧠 Remember Me session persisted successfully.");
  });

  // ======================================
  // ✅ TC3: Empty Email & Password
  // ======================================
  test("should show validation for empty email and password", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("text=Email Address is required")).toBeVisible();
    await expect(
      page.locator("text=Password must be at least 8 characters long")
    ).toBeVisible();
    console.log("✅ Empty input validation messages displayed correctly.");
  });

  // ======================================
  // ✅ TC4: Correct Email, Incorrect Password
  // ======================================
  test("should show error for correct email but wrong password", async ({
    page,
  }) => {
    await page.getByPlaceholder("Email Address").fill(validEmail);
    await page.getByPlaceholder("Password").fill(invalidPassword);
    await page.getByRole("button", { name: "Login" }).click();

    const toast = page.locator("text=Invalid credentials");
    await expect(toast).toBeVisible({ timeout: 8000 });
    console.log("✅ Invalid credentials message displayed.");
  });

  // ======================================
  // ✅ TC5: Invalid Email Format
  // ======================================
  test("should display error for invalid email format", async ({ page }) => {
    await page.getByPlaceholder("Email Address").fill("invalidemail.com");
    await page.getByPlaceholder("Password").fill(validPassword);
    await page.getByRole("button", { name: "Login" }).click();

    const emailError = page.locator("text=Please enter a valid email address");
    const visible = await emailError
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    expect(visible, "Invalid email validation not triggered").toBeTruthy();
    console.log("✅ Invalid Email Address validation triggered successfully.");
  });

  // ======================================
  // ✅ TC6: Password Policy Validation Checks
  // ======================================
  test("should enforce password policy rules", async ({ page }) => {
    await page.getByPlaceholder("Email Address").fill(validEmail);
    const passwordInput = page.getByPlaceholder("Password");
    const loginButton = page.getByRole("button", { name: "Login" });

    const checkError = async (msg) =>
      page
        .locator(`text=${msg}`)
        .isVisible({ timeout: 5000 })
        .catch(() => false);
    const clear = async () => {
      await passwordInput.click({ clickCount: 3 });
      await page.keyboard.press("Backspace");
    };

    // Length check
    await passwordInput.fill("abc");
    await loginButton.click();
    expect(
      await checkError("Password must be at least 8 characters long")
    ).toBeTruthy();

    // Uppercase check
    await clear();
    await passwordInput.fill("abcdefgh");
    await loginButton.click();
    expect(
      await checkError("Password must contain at least one uppercase letter")
    ).toBeTruthy();

    // Number check
    await clear();
    await passwordInput.fill("Abcdefgh");
    await loginButton.click();
    expect(
      await checkError("Password must contain at least one number")
    ).toBeTruthy();

    // Special character check
    await clear();
    await passwordInput.fill("Abcdefg1");
    await loginButton.click();
    expect(
      await checkError("Password must contain at least one special character")
    ).toBeTruthy();

    console.log("🎯 All password validation checks passed.");
  });
});
