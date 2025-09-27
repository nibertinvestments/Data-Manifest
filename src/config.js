// Configuration module for Data Manifest extension
const CONFIG = {
  // Spreadsheet configuration
  SPREADSHEET_URL:
    'https://docs.google.com/spreadsheets/d/1xZUtDQM0ogdr7YKwwSQ0I3MqU0OWqn48e0DGdNfw2qQ/edit?usp=sharing',

  // Extract spreadsheet ID from URL
  get SPREADSHEET_ID() {
    const match = this.SPREADSHEET_URL.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid spreadsheet URL - could not extract ID');
    }
    return match[1];
  },

  // API settings
  API_TIMEOUT: 30000,
  MAX_CONTENT_LENGTH: 100,

  // Sheet configuration
  CREATE_DOMAIN_SHEETS: true,
  DEFAULT_SHEET_NAME: 'ScrapedData',

  // Extension settings
  EXTENSION_NAME: 'Website Data Scraper',
  EXTENSION_VERSION: '1.0.0',

  // OAuth configuration
  OAUTH_SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],

  // Validation
  validate() {
    if (!this.SPREADSHEET_URL || !this.SPREADSHEET_ID) {
      throw new Error('Invalid spreadsheet configuration');
    }
    return true;
  },
};

// Make CONFIG available globally
if (typeof window !== 'undefined') {
  window.DATA_MANIFEST_CONFIG = CONFIG;
} else if (typeof global !== 'undefined') {
  global.DATA_MANIFEST_CONFIG = CONFIG;
} else {
  // For Chrome extension context
  this.DATA_MANIFEST_CONFIG = CONFIG;
}
