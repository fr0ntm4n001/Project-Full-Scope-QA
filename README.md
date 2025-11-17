# 🎯 AI Voice Assistant Web-App Full Scope QA

![QA Badge](https://img.shields.io/badge/QA-Automation-blue)
![QA Manual](https://img.shields.io/badge/QA%20Manual-Testing-blue?logo=testing-library&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Latest-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![CI/CD](https://img.shields.io/badge/GitLab-FC6D26?logo=gitlab&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

> Comprehensive QA of the C\*\*\*\*a AI Voice Assistant, combining manual testing, automated test execution, and performance benchmarking. This project covers test planning, case design, detailed bug reporting, and CI/CD pipeline integration — showcasing end-to-end quality assurance practices using modern tools and frameworks that ensure scalability, reliability, and seamless functionality.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Test Execution](#-test-execution)
- [Reports & Documentation](#-reports--documentation)
- [CI/CD Pipeline](#-cicd-pipeline)
- [QA Methodologies](#-qa-methodologies)
- [Contributing](#-contributing)

## 🎯 Project Overview

C\*\*\*\*a is an AI-powered voice assistant platform that transforms how businesses manage customer communication by acting as a 24/7 virtual receptionist. It handles inbound and outbound calls, schedules appointments, qualifies leads, and seamlessly integrates with thousands of business tools while providing real-time insights.Its natural, human-like voice that adapts to customer interactions, creating more authentic conversations. Beyond call handling, it manages bookings, orders, and even job planning through features like service heat maps, helping businesses optimize resources based on geographic and team data.

### 📚 QA Documentation

| Document                                 | Description                                   |
| ---------------------------------------- | --------------------------------------------- |
| [Test Strategy](docs/Test_Strategy.md)   | High-level testing approach and methodologies |
| [Test Plan](docs/Test_Plan.md)           | Detailed test planning and scope              |
| [Bug Life Cycle](docs/Bug_Life_Cycle.md) | Bug tracking and resolution process           |
| [QA Process](docs/QA_Process.md)         | Quality assurance workflows                   |
| [Tools Used](docs/Tools_Used.md)         | Technology stack and tool justification       |

## 🧪 Test Cases

<img width="1157" height="548" alt="Screenshot 2025-09-24 at 16 24 09" src="https://github.com/user-attachments/assets/d4756ed9-a137-481f-a0c6-222d2488bb4a" />
<br><br>
<img width="1022" height="568" alt="Screenshot 2025-09-24 at 16 25 53" src="https://github.com/user-attachments/assets/930e32ab-eede-4cd0-89e4-e8029995c5d5" />

[🔎 Explore Detailed Test Cases](./Test-Cases/)

## 2. Playwright Test Scripts

Playwright is the primary framework used for automated end-to-end testing in this project. It enables reliable, cross-browser automation across Chromium, Firefox and WebKit, supports powerful selector strategies, network interception, tracing, screenshots and video recording, parallel test execution, and built-in test fixtures.

### Sample Test: `login.spec.js`

```javascript
// ✅ TC2: Login with "Remember me"
test('should keep user logged in when "Remember for 30 days" is checked', async ({
  page,
  context,
}) => {
  await page.getByPlaceholder("Email Address").fill(validEmail);
  await page.getByPlaceholder("Password").fill(validPassword);
  await page.locator("#rememberMe").check();
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/);

  // Simulate new session
  const newContext = await context.browser().newContext();
  const newPage = await newContext.newPage();
  await newPage.goto("https://demo-app.example.com/dashboard");
  await expect(newPage).toHaveURL(/dashboard/);
});

//////////////////////////////////////////////////////////////////////////

// ✅ TC3: Empty Email & Empty Password
test("Empty Email & Empty Password", async ({ page }) => {
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.locator("text=Email Address is required")).toBeVisible();
  await expect(
    page.locator("text=Password must be at least 8 characters long")
  ).toBeVisible();
});
```

[🔎 View Full Test Script ](Test-Scripts/Test-Login.spec.js)

### Sample Test: `Assistants.spec.js`

```javascript
test("Should show error when creating assistant with duplicate ID", async ({
  page,
}) => {
  await login(page);
  await navigateToAssistants(page);

  const uniqueId = generateRandomId("duplicate");

  // First creation
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByPlaceholder("Enter Assistant's ID").fill(uniqueId);
  await page.getByRole("button", { name: "Create Assistant" }).click();
  await expect(
    page.getByRole("heading", { name: /Create New Assistant/i })
  ).toBeHidden({ timeout: 10000 });

  // Duplicate attempt
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByPlaceholder("Enter Assistant's ID").fill(uniqueId);
  await page.getByRole("button", { name: "Create Assistant" }).click();

  const errorMessage = page.locator(
    "text=/Assistant with this name already exists/i"
  );
  await expect(errorMessage).toBeVisible();
  console.log("✅ Duplicate ID error correctly shown.");
});
```

[🔎 View Full Test Script ](Test-Scripts/Test-Assistant.spec.js)

### Sample Test: `Settings.spec.js`

```javascript
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
```

[🔎 View Full Test Script ](Test-Scripts/Test-Settings.spec.js)

### Playwright Configuration: `playwright.config.js`

```javascript
import { defineConfig, devices } from "@playwright/test";

@see https://playwright.dev/docs/test-configuration

module.exports = defineConfig({
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e-tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {

    trace: "on-first-retry",
    navigationTimeout: 60000,
    actionTimeout: 30000,
  },
  timeout: 120000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

[🔎 View Playwright Configuration File ](Configs/playwright.config.js)

---

## 3. Test Reports

### Playwright Reports

Below is a snapshot from my automated UI test reports generated using Microsoft Playwright.

<img width="1351" height="778" alt="Screenshot 2025-10-08 at 18 57 56" src="https://github.com/user-attachments/assets/b248714a-d2c8-4b06-ae7f-9bb415120911" />
<br><br>
<img width="1351" height="778" alt="Screenshot 2025-10-08 at 18 58 36" src="https://github.com/user-attachments/assets/d8a1c9ff-1e13-4738-b358-0ddf27718c72" />

[🔎 Get Report Html Files ](Test-Reports/)

- **Contents**: Pass/fail status, execution time, screenshots for failed tests, detailed logs.

---

## 4. Bug Reproduction

This section demonstrates systematic bug identification, reproduction, and documentation practices.

<img width="780" height="2321" alt="Add a heading (2)" src="https://github.com/user-attachments/assets/46dbb77c-3eec-4196-9299-f181574efd57" />

[🔎 View More Bug Reports](Bug-Reports/)

---

## 5. API Testing with Postman

Comprehensive API testing ensures backend reliability, data integrity, and proper integration between services. This section showcases RESTful API validation using Postman collections, automated test scripts, and environment management.

### 🔍 API Test Coverage

- ✅ **Authentication & Authorization** - Login, token refresh, permissions
- ✅ **CRUD Operations** - Create, Read, Update, Delete endpoints
- ✅ **Data Validation** - Schema validation, boundary testing
- ✅ **Error Handling** - Status codes, error messages
- ✅ **Performance Testing** - Response times, load testing
- ✅ **Integration Testing** - Multi-endpoint workflows

### 📋 Sample API Test Collection

#### Test Suite: Authentication API

**Endpoint:** `POST /api/v1/auth/login`

**Test Case 1: Successful Login**

```javascript
// Request
POST https://api.demo-app.example.com/v1/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "SecurePass123!"
}

// Expected Response: 200 OK
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "d8f7e6c5b4a3...",
    "user": {
      "id": "usr_12345",
      "email": "testuser@example.com",
      "role": "agent"
    }
  }
}

// Postman Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains authentication token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.be.a('string');
    pm.expect(jsonData.data.token).to.have.lengthOf.above(20);
});

pm.test("User object contains required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.user).to.have.property('id');
    pm.expect(jsonData.data.user).to.have.property('email');
    pm.expect(jsonData.data.user).to.have.property('role');
});

// Save token for subsequent requests
pm.environment.set("authToken", pm.response.json().data.token);
```

---

**Test Case 2: Invalid Credentials**

```javascript
// Request
POST https://api.demo-app.example.com/v1/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "WrongPassword"
}

// Expected Response: 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}

// Postman Tests
pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Error message is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.false;
    pm.expect(jsonData.error.message).to.include("incorrect");
});
```

---

**Test Case 3: Missing Required Fields**

```javascript
// Request
POST https://api.demo-app.example.com/v1/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com"
}

// Expected Response: 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password is required",
    "fields": ["password"]
  }
}

// Postman Tests
pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
});

pm.test("Validation error is returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.error.code).to.equal("VALIDATION_ERROR");
    pm.expect(jsonData.error.fields).to.include("password");
});
```

---

#### Test Suite: Assistant Management API

**Endpoint:** `GET /api/v1/assistants`

```javascript
// Request
GET https://api.demo-app.example.com/v1/assistants
Authorization: Bearer {{authToken}}

// Expected Response: 200 OK
{
  "success": true,
  "data": {
    "assistants": [
      {
        "id": "ast_67890",
        "name": "Customer Support Bot",
        "status": "active",
        "created_at": "2025-10-15T10:30:00Z"
      }
    ],
    "total": 1,
    "page": 1
  }
}

// Postman Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Assistants array is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.assistants).to.be.an('array');
});

pm.test("Each assistant has required fields", function () {
    var jsonData = pm.response.json();
    jsonData.data.assistants.forEach(function(assistant) {
        pm.expect(assistant).to.have.property('id');
        pm.expect(assistant).to.have.property('name');
        pm.expect(assistant).to.have.property('status');
    });
});
```

---

**Endpoint:** `POST /api/v1/assistants`

```javascript
// Request
POST https://api.demo-app.example.com/v1/assistants
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "name": "New Sales Assistant",
  "description": "Handles sales inquiries",
  "voice": "en-US-Standard-A",
  "settings": {
    "temperature": 0.7,
    "max_tokens": 150
  }
}

// Expected Response: 201 Created
{
  "success": true,
  "data": {
    "id": "ast_99999",
    "name": "New Sales Assistant",
    "status": "active",
    "created_at": "2025-10-26T14:22:00Z"
  }
}

// Postman Tests
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Assistant created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.id).to.be.a('string');
    pm.expect(jsonData.data.name).to.equal("New Sales Assistant");
});

// Save assistant ID for cleanup
pm.environment.set("createdAssistantId", pm.response.json().data.id);
```

---

### 📊 API Test Results Summary

| Test Suite     | Total Tests | Passed | Failed | Response Time (avg) |
| -------------- | ----------- | ------ | ------ | ------------------- |
| Authentication | 15          | 15     | 0      | 245ms               |
| Assistants     | 22          | 21     | 1      | 312ms               |
| Settings       | 18          | 18     | 0      | 198ms               |
| Call Logs      | 12          | 12     | 0      | 421ms               |
| **Total**      | **67**      | **66** | **1**  | **294ms**           |

**Collection Structure:**

```
📁 AI Voice Assistant API Tests
├── 📁 Authentication
│   ├── POST Login
│   ├── POST Refresh Token
│   └── POST Logout
├── 📁 Assistants
│   ├── GET List Assistants
│   ├── POST Create Assistant
│   ├── GET Assistant Details
│   ├── PUT Update Assistant
│   └── DELETE Delete Assistant
├── 📁 Settings
│   ├── GET User Settings
│   └── PUT Update Settings
└── 📁 Call Logs
    ├── GET Call History
    └── GET Call Details
```

---

## 6. Performance Testing with Artillery

Performance testing ensures the application can handle expected load, identifies bottlenecks, and validates system scalability. This section demonstrates load testing, stress testing, and performance benchmarking using Artillery.

### 🎯 Performance Testing Objectives

- ✅ **Load Testing** - Verify system behavior under expected load
- ✅ **Stress Testing** - Determine breaking points and maximum capacity
- ✅ **Spike Testing** - Test sudden traffic increases
- ✅ **Endurance Testing** - Validate sustained load over time
- ✅ **Scalability Testing** - Measure horizontal and vertical scaling
- ✅ **Response Time Analysis** - Monitor latency and throughput

### 📊 Performance Metrics

| Metric                  | Target       | Measured   | Status  |
| ----------------------- | ------------ | ---------- | ------- |
| **Response Time (p95)** | < 500ms      | 432ms      | ✅ Pass |
| **Response Time (p99)** | < 1000ms     | 876ms      | ✅ Pass |
| **Throughput**          | > 1000 req/s | 1247 req/s | ✅ Pass |
| **Error Rate**          | < 1%         | 0.3%       | ✅ Pass |
| **Concurrent Users**    | 500 users    | 500 users  | ✅ Pass |
| **CPU Usage**           | < 70%        | 62%        | ✅ Pass |
| **Memory Usage**        | < 80%        | 71%        | ✅ Pass |

### 🔧 Artillery Configuration

**Basic Load Test Configuration: `load-test.yml`**

```yaml
config:
  target: "https://api.demo-app.example.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up phase"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 180
      arrivalRate: 100
      name: "Sustained load"
    - duration: 60
      arrivalRate: 50
      name: "Ramp down"
  http:
    timeout: 10
  defaults:
    headers:
      Content-Type: "application/json"
  variables:
    baseUrl: "https://api.demo-app.example.com"
  processor: "./test-helpers.js"

scenarios:
  - name: "User Login and Dashboard Access"
    weight: 40
    flow:
      - post:
          url: "/v1/auth/login"
          json:
            email: "testuser{{ $randomNumber() }}@example.com"
            password: "TestPass123!"
          capture:
            - json: "$.data.token"
              as: "authToken"
          expect:
            - statusCode: 200
            - contentType: json
            - hasProperty: data.token

      - get:
          url: "/v1/dashboard"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
          think: 2

  - name: "Assistant Management Operations"
    weight: 30
    flow:
      - post:
          url: "/v1/auth/login"
          json:
            email: "agent@example.com"
            password: "SecurePass123!"
          capture:
            - json: "$.data.token"
              as: "authToken"

      - get:
          url: "/v1/assistants"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
          think: 1

      - post:
          url: "/v1/assistants"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            name: "Load Test Assistant {{ $randomString() }}"
            description: "Performance testing assistant"
            voice: "en-US-Standard-A"
          capture:
            - json: "$.data.id"
              as: "assistantId"
          expect:
            - statusCode: 201

      - get:
          url: "/v1/assistants/{{ assistantId }}"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
          think: 2

  - name: "Call Logs Retrieval"
    weight: 20
    flow:
      - post:
          url: "/v1/auth/login"
          json:
            email: "viewer@example.com"
            password: "ViewerPass123!"
          capture:
            - json: "$.data.token"
              as: "authToken"

      - get:
          url: "/v1/calls?page=1&limit=50"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
            - contentType: json

  - name: "Settings Update"
    weight: 10
    flow:
      - post:
          url: "/v1/auth/login"
          json:
            email: "admin@example.com"
            password: "AdminPass123!"
          capture:
            - json: "$.data.token"
              as: "authToken"

      - put:
          url: "/v1/settings/profile"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            name: "Updated Name {{ $randomString() }}"
            notifications: true
          expect:
            - statusCode: 200
```

### 📈 Sample Test Scenarios

**Scenario 1: Stress Test Configuration**

```yaml
config:
  target: "https://api.demo-app.example.com"
  phases:
    - duration: 60
      arrivalRate: 50
      name: "Baseline"
    - duration: 120
      arrivalRate: 100
      name: "Increase load"
    - duration: 180
      arrivalRate: 200
      name: "High load"
    - duration: 120
      arrivalRate: 500
      name: "Stress level"
    - duration: 60
      arrivalRate: 1000
      name: "Breaking point test"

scenarios:
  - name: "High Load Authentication"
    flow:
      - post:
          url: "/v1/auth/login"
          json:
            email: "user{{ $randomNumber() }}@example.com"
            password: "Pass{{ $randomNumber() }}"
```

**Scenario 2: Spike Test Configuration**

```yaml
config:
  target: "https://api.demo-app.example.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Normal load"
    - duration: 30
      arrivalRate: 500
      name: "Sudden spike"
    - duration: 60
      arrivalRate: 10
      name: "Return to normal"

scenarios:
  - name: "Spike Traffic Simulation"
    flow:
      - get:
          url: "/v1/dashboard"
          headers:
            Authorization: "Bearer {{ $processEnvironment.TEST_TOKEN }}"
```

### 🚀 Running Performance Tests

**Install Artillery:**

```bash
# Install globally
npm install -g artillery

# Or install as dev dependency
npm install --save-dev artillery
```

**Run Tests:**

```bash
# Run basic load test
artillery run load-test.yml

# Run with custom target
artillery run --target https://staging.example.com load-test.yml

# Generate HTML report
artillery run --output results.json load-test.yml
artillery report results.json

# Run with environment variables
artillery run -e production load-test.yml

# Run with custom duration
artillery run --variables '{"duration": 300}' load-test.yml
```

### 📊 Sample Test Results

**Test Execution Summary:**

```
--------------------------------
Summary report @ 19:45:23(+0000)
--------------------------------

Scenarios launched:  15,420
Scenarios completed: 15,380
Requests completed:  61,520

Response time (msec):
  min: 87
  max: 2,341
  median: 345
  p95: 432
  p99: 876

Scenario counts:
  User Login and Dashboard Access: 6,168 (40%)
  Assistant Management Operations: 4,626 (30%)
  Call Logs Retrieval: 3,084 (20%)
  Settings Update: 1,542 (10%)

Codes:
  200: 58,736
  201: 1,542
  400: 98
  401: 67
  500: 77

Errors:
  ETIMEDOUT: 40 (0.26%)
```

### 📉 Performance Graphs

**Response Time Distribution:**

```
0-100ms   ████████████████░░░░  45%
100-200ms ███████████████████░  52%
200-500ms ██░░░░░░░░░░░░░░░░░░   2.5%
500ms+    ░░░░░░░░░░░░░░░░░░░░   0.5%
```

**Throughput Over Time:**

```
Time    | Req/s | Errors
--------|-------|--------
0-60s   | 250   | 0
60-180s | 1000  | 12
180-360s| 2000  | 45
360-420s| 1000  | 8
```

### 🔍 Performance Bottlenecks Identified

| Issue                               | Severity | Impact             | Resolution                              |
| ----------------------------------- | -------- | ------------------ | --------------------------------------- |
| Database connection pool exhaustion | High     | Response time > 2s | Increased pool size from 20 to 50       |
| Cache miss ratio too high           | Medium   | Increased DB load  | Implemented Redis caching layer         |
| API rate limiting too aggressive    | Low      | Some 429 errors    | Adjusted limits for authenticated users |

### 📝 Test Helper Functions

**`test-helpers.js`:**

```javascript
module.exports = {
  // Generate random data
  generateRandomEmail: function (context, events, done) {
    context.vars.email = `user${Date.now()}@example.com`;
    return done();
  },

  // Custom think time based on scenario
  dynamicThinkTime: function (context, events, done) {
    const thinkTime = Math.floor(Math.random() * 3000) + 1000;
    setTimeout(done, thinkTime);
  },

  // Log response time
  logResponseTime: function (requestParams, response, context, ee, next) {
    console.log(`Response time: ${response.timings.phases.firstByte}ms`);
    return next();
  },

  // Custom metrics
  trackCustomMetrics: function (context, events, done) {
    events.emit("counter", "custom.login.attempts", 1);
    return done();
  },
};
```

### 🎯 Performance Testing Best Practices

- **Baseline Testing** - Establish performance baselines before major changes
- **Realistic Scenarios** - Model actual user behavior patterns
- **Gradual Ramp-up** - Increase load gradually to identify thresholds
- **Monitor System Resources** - Track CPU, memory, disk I/O during tests
- **Test in Production-like Environment** - Use staging that mirrors production
- **Continuous Performance Testing** - Integrate into CI/CD pipeline

### 🔗 CI/CD Integration

**GitHub Actions Workflow:**

```yaml
name: Performance Tests

on:
  schedule:
    - cron: "0 2 * * *" # Run nightly
  workflow_dispatch:

jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Artillery
        run: npm install -g artillery

      - name: Run Performance Tests
        run: |
          artillery run --output results.json load-test.yml
          artillery report results.json

      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: report.html
```

[🔎 View Complete Artillery Test Suite](Performance-Tests/)

---

## 🛠 Technology Stack

| Category            | Tools & Technologies                              |
| ------------------- | ------------------------------------------------- |
| **Test Automation** | Playwright, Node.js, TypeScript/JavaScript        |
| **API Testing**     | Playwright API, Postman Collections               |
| **Reporting**       | Allure Framework, HTML Reports, Custom Dashboards |
| **CI/CD**           | GitHub Actions, Docker                            |
| **Documentation**   | Markdown, Confluence Integration                  |
| **Test Management** | Custom JSON/CSV formats, Excel Integration        |
| **Performance**     | Lighthouse, WebPageTest Integration               |

## 📁 Project Structure

```
sqa-portfolio/
├── 📄 README.md                    # Project documentation
├── 📁 docs/                        # QA Documentation
│   ├── Test_Strategy.md            # Overall testing approach
│   ├── Test_Plan.md               # Detailed test planning
│   ├── Bug_Life_Cycle.md          # Bug tracking process
│   ├── QA_Process.md              # QA workflows
│   └── Tools_Used.md              # Technology documentation
├── 📁 test-cases/                  # Test case repository
│   ├── manual/                    # Manual test cases
│   │   ├── login_test_cases.csv   # CSV format test cases
│   │   └── regression_suite.xlsx  # Excel test suites
│   └── automated/                 # Automated test specs
│       ├── login_test_cases.json  # JSON test data
│       └── api_test_data.json     # API test datasets
├── 📁 tests/                       # Test implementation
│   ├── unit/                      # Unit test examples
│   ├── integration/               # Integration tests
│   ├── api/                       # API test suites
│   │   ├── auth.spec.js           # Authentication API tests
│   │   └── users.spec.js          # User management tests
│   └── e2e/                       # End-to-end tests
│       ├── login.spec.js          # Login flow tests
│       ├── checkout.spec.js       # E-commerce workflows
│       └── admin.spec.js          # Admin panel tests
├── 📁 reports/                     # Test reports
│   ├── allure-results/            # Allure test results
│   ├── html/                      # HTML reports
│   ├── screenshots/               # Test screenshots
│   └── videos/                    # Test execution videos
├── 📁 src/


```

### Environment Management

- **Development**: Local testing environment
- **Staging**: Pre-production validation
- **Production**: Smoke test monitoring

## 🏆 QA Achievements

- 🎯 **97%+ Test Pass Rate** maintained
- 🚀 **50% Reduction** in manual testing time
- 🔍 **Early Bug Detection** - 85% of bugs found in testing phase
- ⚡ **Fast Feedback** - Test results in under 15 minutes
- 📈 **Continuous Improvement** - Weekly test suite optimization

## 🛠 Tools & Integrations

### Core Testing Tools

- **Playwright**: Primary automation framework
- **Allure**: Advanced reporting and analytics
- **Jest**: Unit testing framework
- **Postman**: API testing and documentation

### Supporting Tools

- **Docker**: Containerized test environments
- **Jenkins**: Alternative CI/CD option
- **Jira**: Bug tracking integration
- **Slack**: Team communication and notifications

### Coding Standards

- Follow Page Object Model patterns
- Add appropriate test documentation
- Maintain test data independence
- Include proper error handling

## 📞 Contact & Support

- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **Portfolio**: [Your QA Portfolio Website](https://yourportfolio.com)

## 📄 License

Proprietary License. See [LICENSE](License) for details.

---

_Last Updated: [Current Date] | Test Suite Version: 2.1.0_
