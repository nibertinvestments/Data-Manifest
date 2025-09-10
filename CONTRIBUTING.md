# Contributing to Data Manifest

Thank you for your interest in contributing to Data Manifest! This document provides guidelines and instructions for contributors.

## Development Setup

1. **Fork and Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/Data-Manifest.git
   cd Data-Manifest
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your Google Sheets configuration
   ```

4. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project directory

## Development Workflow

### Before Making Changes

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Run Tests**

   ```bash
   npm test
   ```

3. **Check Code Quality**
   ```bash
   npm run lint
   npm run format:check
   ```

### Making Changes

1. **Write Tests First** (TDD approach)
   - Add tests in the `tests/` directory
   - Run tests with `npm test`
   - Ensure they fail initially

2. **Implement Your Changes**
   - Keep changes focused and minimal
   - Follow existing code patterns
   - Add comments for complex logic

3. **Test Your Changes**

   ```bash
   npm run validate  # Runs lint, test, and format checks
   ```

4. **Test in Browser**
   - Load the extension in Chrome
   - Test functionality manually
   - Check console for errors

### Code Style Guidelines

- **JavaScript**: Follow ESLint configuration
- **Formatting**: Use Prettier (run `npm run format`)
- **Naming**: Use camelCase for variables and functions
- **Comments**: Add JSDoc comments for functions
- **Async/Await**: Prefer async/await over Promises

### Testing Guidelines

- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test component interactions
- **Browser Tests**: Test extension functionality in Chrome
- **Coverage**: Aim for >80% test coverage

## Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add/update JSDoc comments
   - Update CHANGELOG.md

2. **Ensure Quality**

   ```bash
   npm run build  # Runs all quality checks
   ```

3. **Submit Pull Request**
   - Use descriptive title and description
   - Reference related issues
   - Include screenshots for UI changes

4. **Address Feedback**
   - Respond to review comments
   - Make requested changes
   - Re-request review when ready

## Coding Standards

### File Structure

```
src/
├── background.js      # Service worker
├── content.js        # Content script
└── popup.html        # Extension popup

tests/
├── setup.js          # Test configuration
├── background.test.js # Background script tests
└── content.test.js   # Content script tests
```

### Function Documentation

```javascript
/**
 * Scrapes data from the current page
 * @param {Object} options - Scraping options
 * @param {number} options.maxLength - Maximum content length
 * @returns {Object} Scraped page data
 */
function scrapePage(options) {
  // Implementation
}
```

### Error Handling

```javascript
try {
  // Risky operation
  const result = await riskyFunction();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  // Handle gracefully
}
```

## Issue Guidelines

### Bug Reports

- Use the bug report template
- Include steps to reproduce
- Provide browser/OS information
- Include console errors

### Feature Requests

- Use the feature request template
- Explain the use case
- Provide examples if possible
- Consider implementation complexity

## Release Process

1. **Version Bump**

   ```bash
   npm version patch|minor|major
   ```

2. **Update Changelog**
   - Document all changes
   - Follow semantic versioning

3. **Create Release**
   - Tag the release
   - Upload to Chrome Web Store
   - Update documentation

## Getting Help

- **Documentation**: Check the [docs/](docs/) directory
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Tag maintainers for review

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow GitHub's Community Guidelines

Thank you for contributing to Data Manifest!
