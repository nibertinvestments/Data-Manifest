# API Documentation

This document describes the internal APIs and data structures used by the Data Manifest extension.

## Chrome Extension APIs

### Background Script (`src/background.js`)

The background script acts as a service worker that coordinates data scraping and storage operations.

#### Event Listeners

##### `chrome.tabs.onUpdated`

Listens for tab updates and triggers data scraping when a page completes loading.

```javascript
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Process the page
  }
});
```

**Parameters:**

- `tabId` (number): The ID of the tab that was updated
- `changeInfo` (object): Contains properties that changed
  - `status` (string): Loading status ('loading', 'complete')
- `tab` (object): The tab information
  - `url` (string): The tab's URL
  - `title` (string): The tab's title

#### Data Processing Flow

1. **Page Detection**: Triggered when `changeInfo.status === 'complete'`
2. **Data Extraction**: Sends message to content script
3. **Authentication**: Gets Google OAuth token
4. **Data Storage**: Appends data to Google Sheets
5. **Sheet Management**: Creates domain-specific sheets

### Content Script (`src/content.js`)

The content script runs in the context of web pages and extracts data.

#### Message Handler

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    const data = extractPageData();
    sendResponse(data);
  }
});
```

**Message Format:**

```javascript
// Request
{
  action: "scrape"
}

// Response
{
  url: string,      // Page URL
  title: string,    // Page title
  content: string   // First 100 characters of body text
}
```

## Google Sheets API Integration

### Authentication

Uses OAuth2 with Chrome Identity API:

```javascript
const accessToken = await new Promise(resolve => {
  chrome.identity.getAuthToken({ interactive: true }, resolve);
});
```

### Data Append Operation

Appends scraped data to the spreadsheet:

```javascript
const response = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A1:append?valueInputOption=RAW`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [[data.url, data.title, data.content]],
    }),
  }
);
```

### Sheet Creation

Creates new sheets for each domain:

```javascript
const response = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/sheets`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle, // Domain name (e.g., 'example.com')
      },
    }),
  }
);
```

## Data Structures

### Scraped Data Object

```typescript
interface ScrapedData {
  url: string; // Full page URL
  title: string; // Page title from document.title
  content: string; // First 100 characters of document.body.innerText
}
```

### Spreadsheet Configuration

```typescript
interface SpreadsheetConfig {
  spreadsheetId: string; // Google Sheets document ID
  sheetTitle: string; // Sheet name (domain-based)
  valueInputOption: 'RAW' | 'USER_ENTERED';
}
```

## Error Handling

### Background Script Errors

All operations in the background script are wrapped in try-catch blocks:

```javascript
try {
  // Risky operations
} catch (error) {
  console.error('Error in background script:', error);
}
```

### Common Error Scenarios

1. **Authentication Failure**: OAuth token expired or invalid
2. **API Rate Limits**: Google Sheets API rate limiting
3. **Network Errors**: Connection failures
4. **Permission Errors**: Missing sheet permissions

### Error Recovery

- **Retry Logic**: Implement exponential backoff for transient errors
- **Graceful Degradation**: Continue functioning with reduced capabilities
- **User Notification**: Surface critical errors to the user

## Configuration

### Environment Variables

The extension can be configured using environment variables:

```javascript
// Default configuration
const config = {
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || 'default-id',
  clientId: process.env.GOOGLE_CLIENT_ID || 'default-client-id',
  maxContentLength: parseInt(process.env.MAX_CONTENT_LENGTH) || 100,
  apiTimeout: parseInt(process.env.API_TIMEOUT) || 30000,
};
```

### Manifest Configuration

Key manifest.json properties:

```json
{
  "permissions": [
    "activeTab", // Access to active tab
    "tabs", // Tab information
    "storage", // Local storage
    "identity" // OAuth authentication
  ],
  "oauth2": {
    "client_id": "your-google-oauth-client-id"
  }
}
```

## Testing APIs

### Mock Chrome APIs

Test setup provides mocked Chrome APIs:

```javascript
global.chrome = {
  tabs: {
    onUpdated: { addListener: jest.fn() },
    sendMessage: jest.fn(),
  },
  identity: {
    getAuthToken: jest.fn(),
  },
  runtime: {
    onMessage: { addListener: jest.fn() },
  },
};
```

### Test Utilities

Helper functions for testing:

```javascript
// Mock page data
const mockPageData = {
  url: 'https://example.com/test',
  title: 'Test Page',
  content: 'Test content...',
};

// Mock API responses
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({}),
});
```

## Performance Considerations

### Content Script Optimization

- **Minimal DOM Access**: Cache DOM elements
- **Efficient Text Extraction**: Use `innerText` over `textContent`
- **Size Limits**: Limit content to 100 characters

### Background Script Optimization

- **Batch Operations**: Group API calls when possible
- **Caching**: Cache authentication tokens
- **Rate Limiting**: Respect Google Sheets API limits

### Memory Management

- **Event Listener Cleanup**: Remove listeners when not needed
- **Data Size Limits**: Prevent memory leaks from large content
- **Garbage Collection**: Allow objects to be garbage collected

## Security Considerations

### Data Protection

- **Minimal Data Collection**: Only collect necessary data
- **Secure Transmission**: Use HTTPS for all API calls
- **Token Security**: Store OAuth tokens securely

### Permission Management

- **Principle of Least Privilege**: Request minimal permissions
- **User Consent**: Obtain explicit consent for data collection
- **Transparency**: Document all data collection practices
