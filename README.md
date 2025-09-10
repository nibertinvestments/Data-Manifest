# Data Manifest - Website Data Scraper

A Chrome browser extension that automatically scrapes data from visited websites and stores it in Google Sheets.

## Features

- **Automatic Data Scraping**: Extracts URL, title, and content from visited web pages
- **Google Sheets Integration**: Stores scraped data directly in Google Sheets
- **OAuth2 Authentication**: Secure Google authentication for Sheets access
- **Per-Domain Organization**: Creates separate sheets for each website domain
- **Real-time Processing**: Processes data as you browse

## Installation

### From Source

1. Clone this repository:

   ```bash
   git clone https://github.com/nibertinvestments/Data-Manifest.git
   cd Data-Manifest
   ```

2. Install development dependencies:

   ```bash
   npm install
   ```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select this project directory

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser
- Google Cloud Console account (for Sheets API)

### Development Commands

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Watch tests during development
npm run test:watch

# Build for production
npm run build

# Development mode with hot reload
npm run dev
```

### Google Sheets Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create OAuth2 credentials for a Chrome extension
5. Update the `client_id` in `manifest.json` with your credentials

## Project Structure

```
├── src/                    # Source code
│   ├── background.js       # Service worker for data processing
│   ├── content.js         # Content script for data extraction
│   └── popup.html         # Extension popup interface
├── tests/                 # Test files
├── docs/                  # Documentation
├── manifest.json          # Chrome extension manifest
├── package.json          # Node.js dependencies and scripts
└── README.md             # This file
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CLIENT_ID=your_oauth_client_id_here
```

### Spreadsheet Configuration

The extension uses a Google Sheets document to store data. You can:

1. Create a new Google Sheets document
2. Copy the spreadsheet ID from the URL
3. Update the `spreadsheetId` in `background.js` or use environment variables

## Usage

1. Install the extension in Chrome
2. Navigate to any website
3. The extension automatically scrapes and stores data
4. Check your Google Sheets document for the collected data
5. Each domain gets its own sheet tab

## Data Format

The extension stores the following data for each page visit:

| Column  | Description                          |
| ------- | ------------------------------------ |
| URL     | Full page URL                        |
| Title   | Page title                           |
| Content | First 100 characters of page content |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Lint your code: `npm run lint`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## Testing

The project uses Jest for testing. Tests are located in the `tests/` directory.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Quality

We use ESLint and Prettier for code quality and formatting:

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## Privacy & Security

- The extension only processes data from pages you actively visit
- All data is stored in your personal Google Sheets account
- OAuth2 ensures secure authentication with Google services
- No data is transmitted to third-party servers (except Google Sheets)

## License

This project is licensed under the CC0 1.0 Universal License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/nibertinvestments/Data-Manifest/issues)
3. Create a new issue if needed

## Roadmap

- [ ] Enhanced data extraction options
- [ ] Support for additional storage backends
- [ ] Data filtering and preprocessing
- [ ] Batch processing capabilities
- [ ] Advanced privacy controls
