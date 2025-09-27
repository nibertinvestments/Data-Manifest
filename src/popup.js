// Popup script for Data Manifest extension

// Import configuration
const script = document.createElement('script');
script.src = 'config.js';
document.head.appendChild(script);

document.addEventListener('DOMContentLoaded', async () => {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const currentDomain = document.getElementById('currentDomain');
  const spreadsheetIdElement = document.getElementById('spreadsheetId');
  const testScrapeButton = document.getElementById('testScrapeButton');
  const openSheetsButton = document.getElementById('openSheetsButton');
  const activityLog = document.getElementById('activityLog');

  // Wait for config to load
  setTimeout(() => {
    const CONFIG = window.DATA_MANIFEST_CONFIG;

    function addLogEntry(message, type = 'info') {
      const logEntry = document.createElement('div');
      logEntry.className = `log-item log-${type}`;
      logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

      activityLog.insertBefore(logEntry, activityLog.firstChild);

      // Keep only last 10 entries
      while (activityLog.children.length > 11) {
        // +1 for the header
        activityLog.removeChild(activityLog.lastChild);
      }
    }

    function updateStatus(text, isActive = false) {
      statusText.textContent = text;
      statusDot.style.backgroundColor = isActive ? '#34a853' : '#ea4335';
    }

    // Get current tab information
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab && tab.url) {
          const domain = new URL(tab.url).hostname;
          currentDomain.textContent = domain;
          addLogEntry(`Current tab: ${domain}`);
        } else {
          currentDomain.textContent = 'No active tab';
          addLogEntry('No active tab found', 'error');
        }
      } catch (error) {
        currentDomain.textContent = 'Error loading tab';
        addLogEntry(`Tab error: ${error.message}`, 'error');
      }
    })();

    // Display spreadsheet ID
    try {
      if (CONFIG && CONFIG.SPREADSHEET_ID) {
        spreadsheetIdElement.textContent = `${CONFIG.SPREADSHEET_ID.substring(0, 20)}...`;
        addLogEntry('Spreadsheet ID configured');
      } else {
        throw new Error('Configuration not available');
      }
    } catch (error) {
      spreadsheetIdElement.textContent = 'Configuration error';
      addLogEntry('Invalid spreadsheet configuration', 'error');
      updateStatus('Configuration error', false);
    }

    // Test scrape functionality
    testScrapeButton.addEventListener('click', async () => {
      updateStatus('Testing scrape...', true);
      testScrapeButton.disabled = true;
      addLogEntry('Starting test scrape...');

      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!tab || !tab.url) {
          throw new Error('No active tab found');
        }

        // Send message to content script
        const data = await chrome.tabs.sendMessage(tab.id, {
          action: 'scrape',
        });

        addLogEntry(`Scraped: ${data.title}`, 'success');
        addLogEntry(`Content: ${data.content.substring(0, 50)}...`);
        updateStatus('Scrape successful', true);

        setTimeout(() => {
          updateStatus('Ready to scrape', false);
        }, 2000);
      } catch (error) {
        addLogEntry(`Scrape failed: ${error.message}`, 'error');
        updateStatus('Scrape failed', false);
      } finally {
        testScrapeButton.disabled = false;
      }
    });

    // Open Google Sheets
    openSheetsButton.addEventListener('click', () => {
      try {
        if (CONFIG && CONFIG.SPREADSHEET_URL) {
          chrome.tabs.create({ url: CONFIG.SPREADSHEET_URL });
          addLogEntry('Opened Google Sheets');
        } else {
          throw new Error('Spreadsheet URL not configured');
        }
      } catch (error) {
        addLogEntry('Invalid spreadsheet URL', 'error');
      }
    });

    // Initialize
    updateStatus('Ready to scrape', true);
    addLogEntry('Popup initialized');
  }, 100); // Small delay to ensure config loads
});
