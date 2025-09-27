/**
 * Tests for background script functionality
 */

describe('Background Script', () => {
  let mockTab;
  let mockChangeInfo;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Setup mock tab data
    mockTab = {
      id: 123,
      url: 'https://example.com/test',
    };

    mockChangeInfo = {
      status: 'complete',
    };

    // Mock chrome.tabs.sendMessage response
    chrome.tabs.sendMessage.mockResolvedValue({
      url: 'https://example.com/test',
      title: 'Test Page',
      content: 'Test content',
    });

    // Mock chrome.identity.getAuthToken
    chrome.identity.getAuthToken.mockImplementation((options, callback) => {
      callback('mock-access-token');
    });
  });

  test('should register tab update listener', () => {
    // Load the background script
    require('../src/background.js');

    expect(chrome.tabs.onUpdated.addListener).toHaveBeenCalledTimes(1);
  });

  test('should process tab when status is complete and has URL', async () => {
    // Mock fetch responses for the new workflow:
    // 1. Check spreadsheet/sheets (sheet doesn't exist)
    // 2. Create new sheet
    // 3. Add header row
    // 4. Append data
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            sheets: [], // No existing sheets, so new sheet needs to be created
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // Create sheet response
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // Header row response
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // Append data response
      });

    // Load the background script
    require('../src/background.js');

    // Get the listener function that was registered
    const listenerCall = chrome.tabs.onUpdated.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];

    // Call the listener function
    await listenerFunction(mockTab.id, mockChangeInfo, mockTab);

    // Verify that sendMessage was called
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(mockTab.id, {
      action: 'scrape',
    });

    // Verify that getAuthToken was called
    expect(chrome.identity.getAuthToken).toHaveBeenCalledWith(
      { interactive: true },
      expect.any(Function)
    );

    // Verify that fetch was called 4 times (check, create, header, append)
    expect(global.fetch).toHaveBeenCalledTimes(4);

    // Verify config validation was called
    expect(global.DATA_MANIFEST_CONFIG.validate).toHaveBeenCalled();
  });

  test('should skip sheet creation if sheet already exists', async () => {
    // Mock fetch responses when sheet already exists:
    // 1. Check spreadsheet/sheets (sheet exists)
    // 2. Append data (no creation needed)
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            sheets: [
              {
                properties: {
                  title: 'example.com',
                },
              },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // Append data response
      });

    // Load the background script
    require('../src/background.js');

    // Get the listener function that was registered
    const listenerCall = chrome.tabs.onUpdated.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];

    // Call the listener function
    await listenerFunction(mockTab.id, mockChangeInfo, mockTab);

    // Verify that fetch was called only 2 times (check and append, no creation)
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('should not process tab when status is not complete', async () => {
    // Load the background script
    require('../src/background.js');

    const incompleteChangeInfo = { status: 'loading' };

    // Get the listener function and call it
    const listenerCall = chrome.tabs.onUpdated.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];
    await listenerFunction(mockTab.id, incompleteChangeInfo, mockTab);

    // Verify that no processing occurred
    expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
    expect(chrome.identity.getAuthToken).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should not process tab when no URL is present', async () => {
    // Load the background script
    require('../src/background.js');

    const tabWithoutUrl = { ...mockTab, url: null };

    // Get the listener function and call it
    const listenerCall = chrome.tabs.onUpdated.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];
    await listenerFunction(mockTab.id, mockChangeInfo, tabWithoutUrl);

    // Verify that no processing occurred
    expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
    expect(chrome.identity.getAuthToken).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should handle errors gracefully', async () => {
    // Mock sendMessage to reject
    chrome.tabs.sendMessage.mockRejectedValue(new Error('Mock error'));

    // Load the background script
    require('../src/background.js');

    // Get the listener function and call it
    const listenerCall = chrome.tabs.onUpdated.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];

    // Should not throw
    await expect(
      listenerFunction(mockTab.id, mockChangeInfo, mockTab)
    ).resolves.toBeUndefined();

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith(
      'Error in background script:',
      expect.any(Error)
    );
  });
});
