# Data Manifest - Chrome Extension Development Instructions

Data Manifest is a Chrome browser extension that automatically scrapes data from visited websites and stores it in Google Sheets using OAuth2 authentication. **Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Environment Setup

- **Node.js**: Version 16.0.0 or higher (currently tested with v20.19.5)
- **npm**: Version 8.0.0 or higher (currently tested with v10.8.2)
- **Chrome Browser**: Required for testing the extension
- **Google Cloud Account**: Needed for Sheets API setup

### Bootstrap and Build Process

```bash
# Install dependencies - NEVER CANCEL: takes ~18 seconds
npm install

# Validate everything works - NEVER CANCEL: takes ~3 seconds, timeout 30+ seconds
npm run build

# Run tests with coverage - NEVER CANCEL: takes ~1 second, timeout 10+ seconds
npm run test:coverage

# Run security audit - NEVER CANCEL: takes ~5 seconds for audit-ci, timeout 30+ seconds
npm audit
npx audit-ci --moderate
```

### Development Commands

```bash
# Development mode: auto-fix linting and format code - takes ~2 seconds
npm run dev

# Validate all code quality checks - NEVER CANCEL: takes ~3 seconds, timeout 30+ seconds
npm run validate

# Individual commands:
npm run lint          # Check for linting issues - takes <1 second
npm run lint:fix       # Auto-fix linting issues - takes <1 second
npm run format         # Format code with Prettier - takes <1 second
npm run format:check   # Check code formatting - takes <1 second
npm test              # Run Jest tests - takes <1 second
npm run test:watch    # Run tests in watch mode
```

### Load Extension in Chrome

Since this is a Chrome extension, you must test it in a browser:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select the project directory
4. The extension will appear in your extensions list

### Create Distribution Package

```bash
# Create extension package for distribution
mkdir -p dist
cp -r src/ dist/
cp manifest.json dist/
cd dist && zip -r ../extension.zip .
```

## Critical Issues and Workarounds

### BOM (Byte Order Mark) Issue

**CRITICAL**: Source files (`src/background.js`, `src/content.js`, `src/popup.html`, `manifest.json`) contain UTF-8 BOM characters that can cause JSON parsing errors in Node.js.

**Fix BOM characters before development:**

```bash
# Remove BOM from source files
sed -i '1s/^\xEF\xBB\xBF//' src/*.js src/*.html manifest.json
```

### Console Warnings in Linting

The background.js file contains expected console.log statements (lines 30 and 53) that generate ESLint warnings. These are intentional and safe to ignore:

```
/src/background.js
  30:9  warning  Unexpected console statement  no-console
  53:9  warning  Unexpected console statement  no-console
```

## Validation

### Manual Testing Scenarios

After making changes, **ALWAYS** perform these validation steps:

1. **Load Extension in Chrome**:
   - Follow the "Load Extension in Chrome" steps above
   - Check that the extension loads without errors
   - Verify the popup opens when clicking the extension icon

2. **Test Data Scraping Functionality** (requires Google Sheets setup):
   - Navigate to any website (e.g., example.com)
   - Open Chrome DevTools → Console
   - Look for success/error messages from the extension
   - Check your configured Google Sheets for new data entries

3. **Code Quality Validation** (ALWAYS run before committing):
   ```bash
   npm run build  # NEVER CANCEL: Full validation pipeline
   ```

### Google Sheets API Setup Required

The extension requires Google Cloud Console setup:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API
3. Create OAuth2 credentials for Chrome extension
4. Update `manifest.json` with your client_id
5. Create a Google Sheets document and note the spreadsheet ID

### Environment Configuration

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
# Edit .env with your Google Sheets configuration
```

## Testing

### Test Coverage Requirements

Current test coverage: **90.47% overall** (aim to maintain >80%)

- Statements: 90.47%
- Branches: 80%
- Functions: 100%
- Lines: 90.47%

### Running Tests

```bash
# Run all tests - NEVER CANCEL: takes ~1 second, timeout 10+ seconds
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode for development
npm run test:watch
```

### Test Files

- `tests/background.test.js` - Background script functionality
- `tests/content.test.js` - Content script functionality
- `tests/setup.js` - Jest configuration with Chrome API mocks

## Architecture and File Structure

### Core Extension Files

```
src/
├── background.js       # Service worker - handles tab updates and Google Sheets API
├── content.js         # Content script - extracts page data
└── popup.html         # Extension popup interface

tests/
├── background.test.js # Background script tests
├── content.test.js   # Content script tests
└── setup.js          # Test configuration with Chrome API mocks
```

### Key Features

- **Automatic Scraping**: Triggers on tab completion (`chrome.tabs.onUpdated`)
- **Google Sheets Integration**: Uses OAuth2 via `chrome.identity.getAuthToken`
- **Domain Organization**: Creates separate sheets per website domain
- **Data Format**: Stores URL, title, and first 100 characters of content

### Chrome Extension Manifest V3

- **Permissions**: `activeTab`, `tabs`, `storage`, `identity`
- **Service Worker**: `src/background.js`
- **Content Scripts**: Runs on `<all_urls>`
- **OAuth2**: Configured for Google Sheets access

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

The CI pipeline runs on Node.js versions 16, 18, and 20:

1. **Test**: Linting, formatting, tests with coverage
2. **Build**: Extension packaging with artifacts
3. **Security**: `npm audit` and `audit-ci --moderate`
4. **Release**: Automated releases on main branch pushes

### CI Commands That Must Pass

```bash
npm ci                    # Clean install
npm run lint             # ESLint checks
npm run format:check     # Prettier formatting
npm run test:coverage    # Jest tests with coverage
npm run build           # Full build pipeline
npm audit --audit-level=moderate   # Security audit
npx audit-ci --moderate # Enhanced security check
```

## Common Tasks Reference

### Quick Command Summary

```bash
# First-time setup
npm install && npm run build

# Daily development
npm run dev             # Fix linting and format
npm run validate        # Check everything

# Before committing
npm run build          # Full validation
```

### File Sizes and Timing

- **npm install**: ~18 seconds, 405 packages
- **npm run build**: ~3 seconds (lint + test + format check)
- **npm test**: <1 second, 9 tests across 2 suites
- **Extension package**: ~2.3KB zipped

### Repository Structure Quick Reference

```
.
├── README.md              # Project documentation
├── CONTRIBUTING.md        # Contribution guidelines
├── package.json          # Node.js dependencies and scripts
├── manifest.json         # Chrome extension manifest
├── .env.example          # Environment configuration template
├── src/                  # Extension source code
├── tests/                # Jest test files
├── docs/                 # Additional documentation
│   ├── API.md           # API documentation
│   └── DEVELOPMENT.md   # Detailed development guide
└── .github/             # GitHub configuration
    └── workflows/       # CI/CD pipelines
```

## Troubleshooting

### Extension Not Loading in Chrome

1. Check manifest.json syntax with: `node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8'))"`
2. Verify no BOM characters: `xxd manifest.json | head -1`
3. Check Chrome DevTools console for errors
4. Ensure all file paths in manifest.json are correct

### Build Failures

1. **Jest cache issues**: `npx jest --clearCache`
2. **Dependency conflicts**: `rm -rf node_modules package-lock.json && npm install`
3. **BOM character errors**: Run the BOM fix command above

### Google Sheets API Issues

1. Verify OAuth2 credentials in manifest.json
2. Check API quotas in Google Cloud Console
3. Ensure Google Sheets API is enabled
4. Test authentication flow in browser DevTools

**NEVER CANCEL builds or long-running commands** - Always set appropriate timeouts and wait for completion.
