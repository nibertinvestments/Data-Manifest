chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const data = await chrome.tabs.sendMessage(tabId, { action: 'scrape' });

      const accessToken = await new Promise(resolve => {
        chrome.identity.getAuthToken({ interactive: true }, resolve);
      });

      const spreadsheetId =
        'https://docs.google.com/spreadsheets/d/1xZUtDQM0ogdr7YKwwSQ0I3MqU0OWqn48e0DGdNfw2qQ/edit?usp=sharing'; // Replace with your actual Google Spreadsheet ID
      const sheetTitle = new URL(tab.url).hostname; // Uses the website's domain as the sheet name

      // Append data to the new sheet
      const appendResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A1:append?valueInputOption=RAW`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[data.url, data.title, data.content]], // Appends scraped data as rows
          }),
        }
      );

      if (appendResponse.ok) {
        console.log('Data appended successfully');
      } else {
        console.error('Error appending data');
      }

      // Create a new sheet for the website
      const createSheetResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/sheets`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              title: sheetTitle,
            },
          }),
        }
      );

      if (createSheetResponse.ok) {
        console.log('New sheet added successfully');
      } else {
        console.error('Error adding sheet');
      }
    } catch (error) {
      console.error('Error in background script:', error);
    }
  }
});
