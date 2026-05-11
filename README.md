# Playwright Test Automation Framework

A comprehensive, production-ready Playwright test automation framework with advanced features for UI and API testing, custom assertions, hooks, decorators, and database utilities.

## ✨ Features

### Core Testing

- **Page Object Model**: Organized page objects with inherited utilities
- **UI & API Testing**: Full support for both browser and API testing
- **Multiple Browsers**: Chrome, Firefox, Safari, Edge support
- **Parallel Execution**: Configurable parallel test execution
- **Test Retry**: Automatic retry mechanism for flaky tests

### Advanced Features

- **Custom Assertions Library**: Enhanced assertions with better error messages
- **Error Screenshot Manager**: Automatic screenshot capture on failures with organized storage
- **API Client Wrapper**: Simplified API testing with built-in logging and assertions
- **Test Hooks/Listeners**: Custom execution callbacks for test lifecycle events
- **Test Decorators**: Tag tests with metadata (smoke, regression, critical, etc.)
- **Database Utilities**: Abstract database interface for backend verification
- **Environment Management**: Multi-environment configuration (dev, qa, staging, prod)
- **Test Data Management**: JSON-based test data with environment-specific data
- **Comprehensive Logging**: Winston-based logging with file and console output
- **Multiple Reports**: HTML, Allure, JSON, JUnit reports
- **CI/CD Integration**: Pre-configured GitHub Actions workflows

## 📁 Project Structure

```
src/
├── config/              # Environment configuration files (.env.*)
├── fixtures/            # Test fixtures with all utilities
├── pages/               # Page Object classes
├── tests/
│   ├── api/            # API tests
│   └── ui/             # UI tests
├── types/               # TypeScript type definitions
├── utils/               # Utility classes
│   ├── CustomAssertions.ts       # Custom assertion methods
│   ├── ErrorScreenshotManager.ts # Screenshot capture and management
│   ├── APIClient.ts              # API testing wrapper
│   ├── TestHooks.ts              # Test lifecycle hooks
│   ├── TestDecorators.ts         # Test metadata and decorators
│   ├── DatabaseUtil.ts           # Database utilities
│   ├── ElementActionUtil.ts      # Element interactions
│   ├── PageUtil.ts               # Page utilities
│   ├── EnvironmentManager.ts     # Environment configuration
│   ├── TestDataManager.ts        # Test data management
│   └── LoggerUtil.ts             # Logging utility
└── data/                # Test data and constants
    ├── constants.ts
    └── testdata/       # JSON test data files

.github/
└── workflows/          # GitHub Actions CI/CD workflows
    ├── playwright.yml          # Main test workflow
    └── smoke-tests.yml         # Smoke test schedule
```

## 🚀 Quick Start

### Installation

```bash
npm install
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run tests in headed mode (visible browser)
npm run test:headed

# Debug tests interactively
npm run test:debug
```

## 📊 Advanced Features Usage

### Custom Assertions

```typescript
test("login test", async ({ customAssertions, page, loginPage }) => {
  await customAssertions.assertElementVisible(page, "#login-form");
  await loginPage.userLogin("user@test.com", "password");
  await customAssertions.assertPageUrl(page, /.*dashboard/);
});
```

### Error Screenshot Management

```typescript
test("failed test", async ({ page, errorScreenshots, testInfo }) => {
  // Automatically captures on failure in afterEach
  // Or manually:
  await errorScreenshots.captureScreenshot(page, testInfo, "custom_name");
  await errorScreenshots.captureFullPageScreenshot(page, testInfo);
  await errorScreenshots.captureElementScreenshot(page, "#element", testInfo);
});
```

### API Client Wrapper

```typescript
test("api test", async ({ apiClient }) => {
  apiClient.setAuthToken("your-token");

  const response = await apiClient.post("/users", {
    data: { name: "John", email: "john@test.com" },
  });

  await apiClient.assertStatusCode(response, 201);
  await apiClient.assertResponseContainsKey(response, "id");
});
```

### Test Hooks/Listeners

```typescript
// Registered in fixtures, called automatically:
// - onTestStart(testInfo)
// - onTestPass(testInfo)
// - onTestFail(testInfo)
// - onTestSkip(testInfo)
// - onTestEnd(testInfo)

// Access metrics:
const metrics = testHooks.getMetrics();
testHooks.generateMetricsReport();
```

### Test Decorators/Tags

```typescript
import { smoke, critical, regression, jira, priority } from "./utils/TestDecorators";

@smoke
@critical
@jira("PROJ-123")
@priority("high")
test("critical login flow", async ({ loginPage }) => {
  // test code
});

// Filter tests by tag:
npm run test:ui -- --grep "@smoke"
npm run test:ui -- --grep "@critical"
npm run test:ui -- --grep "@regression"
```

### Database Utilities

```typescript
// Implement your database class extending Database abstract class
class MySQLDatabase extends Database {
  async connect() {
    /* ... */
  }
  async query(sql, params) {
    /* ... */
  }
  // ... other methods
}

// Use in tests:
test("db verification", async ({ logger }) => {
  const db = new DatabaseUtil(logger);
  const users = await db.select("users", { id: 123 });

  await db.insert("logs", { userId: 123, action: "login" });
  await db.update("users", { lastLogin: new Date() }, { id: 123 });
});
```

## 📋 Environment Configuration

Create `.env.*` files in `src/config/`:

```env
BASE_URL=https://yourapp.com
HEADLESS=true
BROWSER=chromium
TIMEOUT=30000
RETRIES=2
ENABLE_SCREENSHOTS=true
ENABLE_TRACING=true
ENABLE_VIDEO=true
PARALLEL_EXECUTION=true
MAX_WORKERS=4
```

## 📊 Reporting

### HTML Report

```bash
npm run report:html
```

Opens interactive Playwright HTML report in browser showing:

- Test results
- Screenshots
- Videos
- Traces
- Execution timeline

### Allure Report

```bash
# Generate and open
npm run report:allure

# Generate only
npm run report:allure:generate

# Open existing
npm run report:allure:open
```

Features:

- Beautiful dashboards
- Test history and trends
- Failure analysis
- Detailed attachments
- Test timeline

### JSON and XML Reports

- **JSON**: `test-results/results.json` - Machine-readable format
- **XML**: `test-results/results.xml` - JUnit format for CI/CD integration

## 🔄 CI/CD Integration

### GitHub Actions

Pre-configured workflows in `.github/workflows/`:

#### Main Test Workflow (`playwright.yml`)

- Runs on push and pull requests
- Tests on multiple Node versions (18.x, 20.x)
- Tests multiple browsers (Chromium, Firefox)
- Generates reports and uploads artifacts
- Publishes test reports

#### Smoke Tests (`smoke-tests.yml`)

- Runs every 6 hours
- Runs only smoke-tagged tests
- Notifies Slack on failure
- Lightweight execution

### Secrets Configuration

Add these GitHub secrets:

```
SLACK_WEBHOOK  # For failure notifications
API_TOKEN      # If needed for API tests
DB_PASSWORD    # If using database utilities
```

## 🔧 Configuration

### Playwright Config

Edit `playwright.config.ts` to:

- Change browser settings
- Adjust timeouts and retries
- Configure reporting
- Set up projects (UI, API, etc.)

### TypeScript Config

Edit `tsconfig.json` for:

- Path aliases
- Strict mode settings
- Output directories

## 📝 Test Examples

### Simple UI Test with Custom Assertions

```typescript
import { test } from "../fixtures/base_fixture";
import { smoke, critical, priority } from "../utils/TestDecorators";

@smoke
@critical
@priority("high")
test("login with valid credentials", async ({
  page,
  loginPage,
  customAssertions,
  errorScreenshots,
  testInfo
}) => {
  await loginPage.userLogin("user@test.com", "password123");

  await customAssertions.assertElementVisible(page, "#dashboard");
  await customAssertions.assertPageUrl(page, /.*dashboard/);

  // Capture success screenshot
  await errorScreenshots.captureScreenshot(page, testInfo, "logged_in");
});
```

### API Test with APIClient

```typescript
test("create user via API", async ({ apiClient, customAssertions }) => {
  apiClient.setAuthToken(process.env.API_TOKEN || "");

  const response = await apiClient.post("/users", {
    data: {
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    },
  });

  await apiClient.assertStatusCode(response, 201);
  await apiClient.assertResponseValue(response, "role", "admin");

  return response.body.id;
});
```

## 🛠️ Troubleshooting

### Playwright Browsers Not Found

```bash
npx playwright install
```

### Environment File Not Found

Ensure `.env.{NODE_ENV}` exists in `src/config/`:

```bash
# For NODE_ENV=qa, need:
src/config/.env.qa
```

### Port Already in Use

Reports use ports for preview. Check:

```bash
lsof -i :9323  # Allure port
```

## 📚 Documentation

- [Playwright Official Docs](https://playwright.dev)
- [Allure Reports](https://docs.qameta.io/allure/)
- [Winston Logging](https://github.com/winstonjs/winston)

## 🎯 Best Practices

1. **Use Page Objects**: Keep test files clean and maintainable
2. **Tag Your Tests**: Use decorators for better organization
3. **Handle Waits**: Use Playwright's built-in waiting mechanisms
4. **Check Environment**: Always verify NODE_ENV before running tests
5. **Keep Data Clean**: Use database utilities to clean test data
6. **Screenshots on Failure**: Enabled by default in fixtures
7. **Use Custom Assertions**: For better error messages
8. **Log Everything**: Use logger for debugging

## 📞 Support

For issues or questions:

1. Check test logs in `test-results/`
2. View HTML report: `npm run report:html`
3. Check Allure report: `npm run report:allure`
4. Review Playwright documentation

## 📄 License

ISC
