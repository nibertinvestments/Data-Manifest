// Import configuration
importScripts('config.js');

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const data = await chrome.tabs.sendMessage(tabId, { action: 'scrape' });

      const accessToken = await new Promise(resolve => {
        chrome.identity.getAuthToken({ interactive: true }, resolve);
      });

      // Use configuration for spreadsheet settings
      const CONFIG = DATA_MANIFEST_CONFIG;
      CONFIG.validate(); // Ensure configuration is valid

      const spreadsheetId = CONFIG.SPREADSHEET_ID;
      const sheetTitle = new URL(tab.url).hostname; // Uses the website's domain as the sheet name

      // First, try to check if sheet exists and create it if it doesn't
      let sheetExists = false;
      try {
        const checkResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (checkResponse.ok) {
          const spreadsheetData = await checkResponse.json();
          sheetExists = spreadsheetData.sheets?.some(
            sheet => sheet.properties.title === sheetTitle
          );
        }
      } catch (checkError) {
        console.error('Error checking for existing sheet:', checkError);
      }

      // Create sheet if it doesn't exist
      if (!sheetExists) {
        const createSheetResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: sheetTitle,
                    },
                  },
                },
              ],
            }),
          }
        );

        if (createSheetResponse.ok) {
          console.log(`New sheet '${sheetTitle}' created successfully`);

          // Add header row to the new sheet
          const headerResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A1:D1?valueInputOption=RAW`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                values: [['URL', 'Title', 'Content', 'Timestamp']], // Header row with timestamp
              }),
            }
          );

          if (!headerResponse.ok) {
            console.error('Warning: Could not add header row to sheet');
          }
        } else {
          const errorData = await createSheetResponse.json().catch(() => null);
          console.error(
            'Error creating sheet:',
            errorData?.error?.message || 'Unknown error'
          );
        }
      }

      // Now append data to the sheet with timestamp
      const timestamp = new Date().toLocaleString();
      const appendResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:A:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[data.url, data.title, data.content, timestamp]], // Appends scraped data with timestamp
          }),
        }
      );

      if (appendResponse.ok) {
        console.log(`Data appended successfully to '${sheetTitle}' sheet`);
      } else {
        const errorData = await appendResponse.json().catch(() => null);
        console.error(
          'Error appending data:',
          errorData?.error?.message || 'Unknown error'
        );
      }
    } catch (error) {
      console.error('Error in background script:', error);
    }
  }
});
