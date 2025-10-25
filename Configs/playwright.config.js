// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

////////////////////////////////////////////////////////////////////////////// reenable
import dotenv from "dotenv";
dotenv.config();
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: ["**/*.spec.js", "**/*.test.js"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Let CLI override workers, but default to 1 on CI for stability
  workers: process.env.CI ? 1 : undefined,
  // Reporter is set via CLI in CI, but default to HTML locally
  reporter: process.env.CI
    ? [
        ["list"],
        ["junit", { outputFile: "test-results/results.xml" }],
        ["html", { outputFolder: "playwright-report", open: "never" }],
      ]
    : [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "on-failure" }],
      ],
  outputDir: "test-artifacts/",
  use: {
    baseURL: process.env.BASE_URL || "https://convoa-1.taild6271e.ts.net",
    trace: process.env.CI ? "retain-on-failure" : "on-first-retry",
    screenshot: process.env.CI ? "only-on-failure" : "on",
    video: process.env.CI ? "retain-on-failure" : "on-first-retry",
    navigationTimeout: 60 * 1000, // 1 minute
    actionTimeout: 30 * 1000, // 30 seconds
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // To test with other browsers, add them here
  ],

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
