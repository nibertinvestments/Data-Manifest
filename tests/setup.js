// Test setup for Jest with Chrome extension APIs
global.chrome = {
  tabs: {
    onUpdated: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(),
  },
  identity: {
    getAuthToken: jest.fn(),
  },
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
  },
};

// Mock fetch globally
global.fetch = jest.fn();

// Mock importScripts function for service worker
global.importScripts = jest.fn();

// Mock DATA_MANIFEST_CONFIG
global.DATA_MANIFEST_CONFIG = {
  SPREADSHEET_URL:
    'https://docs.google.com/spreadsheets/d/1xZUtDQM0ogdr7YKwwSQ0I3MqU0OWqn48e0DGdNfw2qQ/edit?usp=sharing',
  SPREADSHEET_ID: '1xZUtDQM0ogdr7YKwwSQ0I3MqU0OWqn48e0DGdNfw2qQ',
  validate: jest.fn().mockReturnValue(true),
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Setup DOM for testing
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://example.com/test',
    hostname: 'example.com',
  },
  writable: true,
});

Object.defineProperty(document, 'title', {
  value: 'Test Page Title',
  writable: true,
});

Object.defineProperty(document, 'body', {
  value: {
    innerText:
      'This is test content for the page body that should be scraped by the extension.',
  },
  writable: true,
});
