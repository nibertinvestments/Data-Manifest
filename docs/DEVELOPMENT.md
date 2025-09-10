# Development Guide

This guide provides detailed instructions for setting up and working with the Data Manifest development environment.

## Quick Start

```bash
# Clone and setup
git clone https://github.com/nibertinvestments/Data-Manifest.git
cd Data-Manifest
npm install

# Validate everything works
npm run build

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select this directory
```

## Development Environment

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Chrome Browser**: For testing the extension
- **Google Cloud Account**: For Sheets API setup

### IDE Setup

#### Visual Studio Code (Recommended)

Install these extensions:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss"
  ]
}
```

Configure workspace settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.autoFixOnSave": true,
  "javascript.validate.enable": false
}
```

### Environment Configuration

1. **Copy Environment File**:

   ```bash
   cp .env.example .env
   ```

2. **Configure Google Sheets Access**:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Sheets API
   - Create OAuth2 credentials
   - Update `.env` with your credentials

3. **Update Manifest**:
   ```json
   {
     "oauth2": {
       "client_id": "your-google-oauth-client-id"
     }
   }
   ```

## Development Workflow

### Daily Development

```bash
# Start with a clean state
npm run dev  # Runs lint:fix and format

# Make your changes...

# Validate frequently
npm run validate  # Runs lint, test, format:check

# Before committing
npm run build
```

### File Structure

```
Data-Manifest/
├── src/                    # Source code
│   ├── background.js       # Extension service worker
│   ├── content.js         # Content script for web pages
│   └── popup.html         # Extension popup UI
├── tests/                 # Test files
│   ├── setup.js          # Jest configuration
│   ├── background.test.js # Background script tests
│   └── content.test.js   # Content script tests
├── docs/                  # Documentation
│   └── API.md            # API documentation
├── .github/               # GitHub configuration
│   └── workflows/        # CI/CD pipelines
├── manifest.json         # Chrome extension manifest
├── package.json          # Node.js configuration
└── README.md             # Project documentation
```

### Code Quality Tools

#### ESLint Configuration

```javascript
{
  "env": {
    "browser": true,
    "es2021": true,
    "jest": true,
    "webextensions": true,
    "node": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "no-console": ["warn", { "allow": ["error"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Prettier Configuration

```javascript
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Testing

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx jest tests/content.test.js
```

#### Writing Tests

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('should do something', () => {
    // Arrange
    const mockData = {};

    // Act
    const result = someFunction(mockData);

    // Assert
    expect(result).toBe(expected);
  });
});
```

#### Test Coverage

Aim for these coverage targets:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Chrome Extension Development

#### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the project directory

#### Debugging

- **Background Script**: Use Chrome DevTools → Extensions → Background Page
- **Content Script**: Use regular DevTools on any webpage
- **Popup**: Right-click extension icon → Inspect popup

#### Testing Extension Functionality

1. **Manual Testing**:

   ```bash
   # Start development mode
   npm run dev

   # Load extension in Chrome
   # Navigate to test websites
   # Check Google Sheets for data
   ```

2. **Console Monitoring**:
   - Open DevTools console
   - Monitor for errors/warnings
   - Check network requests

### Build and Deployment

#### Building for Production

```bash
# Full build with all checks
npm run build

# Create distribution package
mkdir dist
cp -r src/ dist/
cp manifest.json dist/
cd dist && zip -r ../extension.zip .
```

#### Release Process

1. **Version Bump**:

   ```bash
   npm version patch  # or minor/major
   ```

2. **Update Changelog**: Document all changes

3. **Create Release**: Tag and upload to Chrome Web Store

### Troubleshooting

#### Common Issues

1. **Extension Not Loading**:
   - Check manifest.json syntax
   - Verify file paths are correct
   - Check console for errors

2. **Tests Failing**:
   - Clear Jest cache: `npx jest --clearCache`
   - Check mock setup in tests/setup.js
   - Verify module imports

3. **Linting Errors**:
   - Run `npm run lint:fix`
   - Check ESLint configuration
   - Update .eslintrc if needed

4. **Google Sheets API Issues**:
   - Verify OAuth2 credentials
   - Check API quotas in Google Cloud Console
   - Ensure Sheets API is enabled

#### Debug Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

### Performance Optimization

#### Code Optimization

- Minimize content script size
- Use efficient DOM queries
- Implement proper error handling
- Cache API responses when possible

#### Testing Performance

```bash
# Analyze bundle size
npx webpack-bundle-analyzer

# Run performance audits
npm run audit

# Check memory usage in Chrome DevTools
```

### Contributing Guidelines

1. **Before Starting**:
   - Check existing issues
   - Create feature branch
   - Run `npm run validate`

2. **During Development**:
   - Write tests first (TDD)
   - Follow code style guidelines
   - Add documentation as needed

3. **Before Submitting**:
   - Run full test suite
   - Check code coverage
   - Update documentation
   - Test manually in Chrome

### Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Jest Testing Framework](https://jestjs.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
