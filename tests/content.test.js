/**
 * Tests for content script functionality
 */

describe('Content Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('should register message listener', () => {
    // Load the content script
    require('../src/content.js');

    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);
  });

  test('should respond to scrape action with page data', () => {
    // Load the content script first
    require('../src/content.js');

    const mockSendResponse = jest.fn();
    const mockRequest = { action: 'scrape' };
    const mockSender = {};

    // Get the listener function that was registered
    const listenerCall = chrome.runtime.onMessage.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];

    // Call the listener function
    listenerFunction(mockRequest, mockSender, mockSendResponse);

    // Verify the response
    expect(mockSendResponse).toHaveBeenCalledWith({
      url: 'https://example.com/test',
      title: 'Test Page Title',
      content:
        'This is test content for the page body that should be scraped by the extension.',
    });
  });

  test('should limit content to 100 characters', () => {
    // Set up long content
    const longContent = 'A'.repeat(200);
    document.body.innerText = longContent;

    // Load the content script
    require('../src/content.js');

    const mockSendResponse = jest.fn();
    const mockRequest = { action: 'scrape' };
    const mockSender = {};

    // Get the listener function and call it
    const listenerCall = chrome.runtime.onMessage.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];
    listenerFunction(mockRequest, mockSender, mockSendResponse);

    // Verify content is limited to 100 characters
    const responseData = mockSendResponse.mock.calls[0][0];
    expect(responseData.content).toHaveLength(100);
    expect(responseData.content).toBe('A'.repeat(100));
  });

  test('should not respond to non-scrape actions', () => {
    // Load the content script
    require('../src/content.js');

    const mockSendResponse = jest.fn();
    const mockRequest = { action: 'other' };
    const mockSender = {};

    // Get the listener function and call it
    const listenerCall = chrome.runtime.onMessage.addListener.mock.calls[0];
    const listenerFunction = listenerCall[0];
    listenerFunction(mockRequest, mockSender, mockSendResponse);

    // Verify no response was sent
    expect(mockSendResponse).not.toHaveBeenCalled();
  });
});
