if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/js/sw.js")
    .then((reg) => {
      console.log("Service worker registered...");
    })
    .catch((err) => {
      console.error("Service worker not registered");
    });
}

var deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  const installer = document.getElementById("installer");
  installer.className = "nav-link";

  deferredPrompt = e;
});

// called by navbar install
function install() {
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      const installer = document.getElementById("installer");
      installer.className = "nav-link disabled";
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    deferredPrompt = null;
  });
}
