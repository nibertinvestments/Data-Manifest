chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const data = {
      url: window.location.href,
      title: document.title,
      content: document.body.innerText.substring(0, 100)  // Limits to first 100 characters for brevity
    };
    sendResponse(data);
  }
});
