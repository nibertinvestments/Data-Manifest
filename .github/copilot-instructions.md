# Data Manifest - Chrome Extension Development

Data Manifest is a Chrome browser extension (Manifest V3) that automatically scrapes data from visited websites and stores it in Google Sheets using OAuth2 authentication.

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Working Effectively

### Bootstrap and Setup

- Check Node.js version: `node --version` (requires Node.js 16+, npm 8+)
- Install dependencies: `npm install` -- takes ~17 seconds
- Validate installation: `npm run build` -- takes ~3 seconds, runs lint + test + format check

### Key Development Commands

- **Lint code**: `npm run lint` -- takes <1 second
- **Auto-fix linting**: `npm run lint:fix` -- takes <1 second
- **Format code**: `npm run format` -- takes ~1.5 seconds
- **Check formatting**: `npm run format:check` -- takes <1 second
- **Run tests**: `npm test` -- takes ~1 second (9 tests, 2 suites)
- **Test with coverage**: `npm run test:coverage` -- takes ~1.3 seconds (90%+ coverage)
- **Full validation**: `npm run validate` -- takes ~3 seconds, runs lint + test + format:check
- **Development mode**: `npm run dev` -- takes ~1.5 seconds, runs lint:fix + format
- **Security audit**: `npm audit` -- takes <1 second

### Build and Package

- **Full build**: `npm run build` -- takes ~3 seconds. INCLUDES lint, test, and format checks
- **Package extension**:
  ```bash
  mkdir -p dist
  cp -r src/ dist/
  cp manifest.json dist/
  cd dist && zip -r ../extension.zip .
  ```
  Takes <1 second, creates production-ready Chrome extension package

## Chrome Extension Development

### Loading Extension in Chrome

1. **Install dependencies first**: `npm install`
2. **Validate build works**: `npm run build`
3. Open Chrome: Navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the repository root directory (contains manifest.json)
7. Extension should load without errors

### Testing Extension Functionality

1. **Load extension** using steps above
2. **Navigate to any website** (e.g., https://example.com)
3. **Check browser console** for any errors
4. **Verify popup works**: Click extension icon, should show simple UI
5. **Check Google Sheets**: Extension attempts to write to configured spreadsheet
6. **Debug background script**: chrome://extensions/ → "Inspect views: background page"

### Google Sheets Setup (Required for Full Functionality)

1. **Create Google Cloud Project**: Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable Google Sheets API** for your project
3. **Create OAuth2 credentials** for Chrome extension
4. **Update manifest.json**: Replace `client_id` in oauth2 section with your credentials
5. **Test authentication**: Extension will prompt for Google login on first use

## Validation

### Mandatory Pre-Commit Validation

- **ALWAYS run**: `npm run validate` before committing changes
- **Alternative**: `npm run build` (does the same validation)
- **CI will fail** if linting or tests fail - use exact same commands locally

### Manual Testing Scenarios

- **Basic Functionality**: Load extension, visit website, check for console errors
- **Data Extraction**: Navigate to different sites, verify content script extracts data
- **OAuth Flow**: Test Google authentication (requires valid OAuth setup)
- **Error Handling**: Test with invalid URLs, network failures, API errors

### Test Coverage Requirements

- **Maintain 90%+ coverage**: `npm run test:coverage`
- **All tests must pass**: `npm test`
- **Current coverage**: 90.47% statements, 80% branches

## Repository Structure

```
Data-Manifest/
├── .github/
│   └── workflows/ci.yml     # CI/CD pipeline (Node 16,18,20)
├── src/
│   ├── background.js        # Service worker (data processing)
│   ├── content.js          # Content script (data extraction)
│   └── popup.html          # Extension popup UI
├── tests/
│   ├── setup.js            # Jest test configuration
│   ├── background.test.js  # Background script tests (5 tests)
│   └── content.test.js     # Content script tests (4 tests)
├── docs/
│   ├── DEVELOPMENT.md      # Detailed development guide
│   └── API.md              # API documentation
├── manifest.json           # Chrome extension manifest (V3)
├── package.json            # Node.js configuration
├── .env.example            # Environment configuration template
├── README.md               # Project documentation
└── CONTRIBUTING.md         # Contribution guidelines
```

## Common Issues and Solutions

### Build/Test Failures

- **Linting warnings**: 2 console warnings in background.js are expected (no-console rule)
- **Test failures**: Run `npx jest --clearCache` then `npm test`
- **Format issues**: Run `npm run format` to auto-fix
- **Dependencies**: Delete node_modules and package-lock.json, run `npm install`

### Extension Loading Issues

- **Manifest errors**: Validate manifest.json syntax
- **File paths**: Ensure src/ directory and files exist
- **Permissions**: Check Chrome developer mode is enabled
- **Console errors**: Open DevTools on extension pages for debugging

### Google Sheets Integration

- **Authentication failures**: Verify OAuth2 client_id in manifest.json
- **API quota limits**: Check Google Cloud Console quotas
- **Permission denied**: Ensure Sheets API is enabled
- **Network errors**: Test with sample spreadsheet ID first

## Configuration Files

### Environment Variables (.env)

```bash
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_CLIENT_ID=your_oauth_client_id
NODE_ENV=development
API_TIMEOUT=30000
MAX_CONTENT_LENGTH=100
```

### Key Dependencies

- **Testing**: Jest with jsdom environment
- **Code Quality**: ESLint + Prettier (configured in package.json)
- **Chrome APIs**: @types/chrome for TypeScript support
- **Coverage**: Built-in Jest coverage reporting

## Performance Notes

- **Extension is lightweight**: ~2KB when packaged
- **Content script**: Extracts only first 100 characters of page content
- **Background processing**: Handles OAuth and API calls efficiently
- **Memory usage**: Minimal impact on browser performance

## Development Workflow

1. **Start development**: `npm run dev` (auto-fixes and formats code)
2. **Make changes** to src/ files
3. **Test frequently**: `npm test` during development
4. **Validate before commit**: `npm run validate`
5. **Package for testing**: Build extension zip if needed
6. **Load in Chrome**: Use developer mode to test changes
7. **Debug**: Use Chrome DevTools for all extension components

## Quick Reference Commands

| Task     | Command                | Time  | Notes                      |
| -------- | ---------------------- | ----- | -------------------------- |
| Install  | `npm install`          | ~17s  | One-time setup             |
| Validate | `npm run validate`     | ~3s   | Pre-commit check           |
| Test     | `npm test`             | ~1s   | 9 tests, 90%+ coverage     |
| Lint     | `npm run lint`         | <1s   | Shows 2 expected warnings  |
| Format   | `npm run format`       | ~1.5s | Auto-fixes formatting      |
| Build    | `npm run build`        | ~3s   | Full validation pipeline   |
| Package  | Extension zip creation | <1s   | Ready for Chrome Web Store |

**Remember**: This extension requires Google Cloud setup for full functionality, but can be loaded and tested in Chrome without it. Always test extension loading after any manifest.json changes.
