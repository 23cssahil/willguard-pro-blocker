// 0. Instant URL Block (Safety First)
const nsfwKeywords = ["porn", "sex", "xvideos", "xnxx", "pornhub", "xxx", "adult", "hentai"];
const currentUrl = window.location.href.toLowerCase();

if (nsfwKeywords.some(keyword => currentUrl.includes(keyword)) && !currentUrl.includes("vercel.app") && !currentUrl.includes("localhost")) {
    console.log("NSFW Content Detected in URL. Redirecting...");
    window.location.href = "https://willguard-pro-blocker.vercel.app/dashboard?alert=blocked";
}

// 1. Sync Bridge: Listen for status updates from the Web App
window.addEventListener("purewill_sync", (event) => {
    // Standard DOM event detail access
    const detail = event.detail;
    console.log("PureWill Sync Event received:", detail);
    if (detail) {
        chrome.runtime.sendMessage({ 
            type: "SYNC_LOCK", 
            isLocked: detail.isLocked,
            partnerEmail: detail.partnerEmail
        });
    }
});

// 2. Image Blurring logic (NSFW-JS Integration)
async function scanImages() {
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    img.style.filter = "blur(10px)";
    setTimeout(() => {
        // img.style.filter = "none"; // Simulation placeholder
    }, 1000);
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      scanImages();
    }
  });
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
  scanImages();
}
