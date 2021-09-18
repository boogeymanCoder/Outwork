if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
        console.log('Service worker registered -->', reg);
    }, (err) => {
        console.error('Service worker not registered -->', err);
    });
}

window.addEventListener('beforeinstallprompt', (deferredPrompt) => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
    });
});