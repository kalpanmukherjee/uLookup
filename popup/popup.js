document.getElementById('saveKey').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({apiKey: apiKey}, function() {
        console.log('API Key saved');
        // console.log(apiKey)
    });
});
