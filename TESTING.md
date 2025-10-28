# Testing Documentation - DevMovies

## 📋 Overview

This project implements a comprehensive testing suite that includes:
- ✅ Unit tests with **Jest** and **React Testing Library**
- ✅ End-to-End tests with **Playwright**
- ✅ Code coverage > 80%
- ✅ CI/CD ready configuration

## 🎯 Test Coverage

### Unit Tests (Jest + RTL)

**Tested Components:**
- `SearchBar.jsx` - 100% coverage
- `MovieCard.jsx` - 100% coverage
- `Pagination.jsx` - 73% coverage
- `omdbApi.js` - Business logic tested

**Coverage Metrics:**
```
✓ Statements: 81.81% (threshold: 80%)
✓ Branches: 76.47% (threshold: 75%)
✓ Functions: 100% (threshold: 100%)
✓ Lines: 83.33% (threshold: 80%)
```

**Total Tests:** 57 tests passing

### E2E Tests (Playwright)

**Covered Scenarios:**
- ✅ Initial page load
- ✅ Movie search functionality
- ✅ Results display
- ✅ Pagination
- ✅ Modal open and close
- ✅ Keyboard navigation
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design (mobile/desktop)

**Total E2E Tests:** 15 scenarios

## 🚀 Available Commands

### Unit Tests

```bash
# Run all unit tests
npm test

# Run in watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run with visible browser
npm run test:e2e:headed

# Run all tests (unit + E2E)
npm run test:all
```

## 📁 Test Structure

```
montagne-imdb/
├── src/
│   ├── components/
│   │   ├── __tests__/              # Component unit tests
│   │   │   ├── SearchBar.test.jsx  # 10 tests
│   │   │   ├── MovieCard.test.jsx  # 11 tests
│   │   │   └── Pagination.test.jsx # 18 tests
│   ├── services/
│   │   └── __tests__/              # Service tests
│   │       └── omdbApi.test.js     # 18 logic tests
├── e2e/
│   └── movie-search.spec.js        # 15 E2E tests
├── coverage/                        # Coverage reports (generated)
├── playwright-report/               # Playwright reports (generated)
├── jest.config.js                   # Jest configuration
├── jest.setup.js                    # Jest global setup
└── playwright.config.js             # Playwright configuration
```

## 🔧 Configuration

### Jest

Configuration in `jest.config.js`:
- **Environment:** jsdom (browser simulation)
- **Transform:** Babel for JSX/ES6+
- **Setup:** @testing-library/jest-dom
- **Coverage:** Configured thresholds
- **Exclusions:** E2E tests, config files

### Playwright

Configuration in `playwright.config.js`:
- **Browser:** Chromium
- **Base URL:** http://localhost:5173
- **Retries:** 2 in CI, 0 locally
- **Reporters:** HTML report
- **Screenshots:** Only on failures
- **Traces:** On first retry

## ✍️ Writing New Tests

### Unit Test (Example)

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('should handle clicks', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test (Example)

```javascript
import { test, expect } from '@playwright/test';

test('should search movies', async ({ page }) => {
  await page.goto('/');
  
  // Interact with the page
  await page.getByPlaceholder(/search movies/i).fill('Matrix');
  await page.getByRole('button', { name: /search/i }).click();
  
  // Verify results
  await expect(page.getByText(/matrix/i).first()).toBeVisible();
});
```

## 🎨 Best Practices

### Unit Tests

1. **Use semantic queries:** `getByRole`, `getByLabelText`
2. **Simulate user interactions:** `userEvent` instead of `fireEvent`
3. **Test behavior, not implementation:** Focus on visible behavior
4. **Use aria-labels:** Improves accessibility and testability
5. **Mock external dependencies:** APIs, external modules

### E2E Tests

1. **Use stable selectors:** Prefer roles and labels over CSS classes
2. **Wait for conditions:** `waitFor`, `toBeVisible()`
3. **Test complete flows:** Real user journeys from start to finish
4. **Screenshots on failures:** Already configured automatically
5. **Independent tests:** Each test should run standalone

## 🐛 Debugging

### Unit Tests

```bash
# Verbose output
npm test -- --verbose

# Run specific file
npm test -- SearchBar.test.jsx

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Tests

```bash
# UI mode for interactive debugging
npm run test:e2e:ui

# View browser during execution
npm run test:e2e:headed

# Run specific test
npx playwright test movie-search.spec.js

# View last report
npx playwright show-report
```

## 📊 CI/CD

### GitHub Actions (example)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🔍 Coverage Reports

After running `npm run test:coverage`, open:
```
coverage/lcov-report/index.html
```

You'll see a detailed report with:
- ✅ Lines covered/not covered
- ✅ Tested if/else branches
- ✅ Executed functions
- ✅ Files with low coverage

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ⚠️ Important Notes

1. **omdbApi.js:** Unit tests focus on logic due to `import.meta.env` incompatibility with Jest. Real integration is tested in E2E.

2. **App.jsx, MovieModal.jsx:** Excluded from unit coverage because they're better tested with E2E where complete interactions are validated.

3. **VITE_OMDB_API_KEY:** E2E tests require a valid `.env` file with your API key.

## ✅ Testing Checklist

Before merging:
- [ ] All unit tests pass (`npm test`)
- [ ] Coverage > 80% (`npm run test:coverage`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] No console warnings
- [ ] Tests run in CI/CD
- [ ] New features have tests

---

**Last updated:** October 28, 2025
**Version:** 1.0.0
