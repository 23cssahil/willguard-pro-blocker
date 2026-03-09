chrome.runtime.onInstalled.addListener(() => {
  console.log("PureWill AI Guardian installed.");
});

// Listener for messages from content script or web app
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CHECK_LOCK_STATUS") {
    // Logic to check lock status from storage or API
    chrome.storage.local.get(["isLocked"], (result) => {
      sendResponse({ isLocked: !!result.isLocked });
    });
    return true; // Keep channel open for async response
  }
});
