chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showFloatingWindow") {
      createFloatingWindow(message.text);
    }
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showLoadingWindow") {
      createLoadingWindow(message.text);
    }
  });
  
  function createLoadingWindow(text) {
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (range) {
        const rect = range.getBoundingClientRect();
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'customLoadingWindow';
        document.body.appendChild(floatingDiv); // Append early to calculate dimensions

        // Basic style for size calculation
        floatingDiv.style.visibility = 'hidden'; // Hide while calculating size
        floatingDiv.style.position = 'absolute';
        floatingDiv.style.zIndex = '1000';

        // floatingDiv.innerText = "Loading..."; // Add text early to calculate size
        const loader = document.createElement('div');
        loader.className = 'loader';
        floatingDiv.appendChild(loader);

        // Set up the CSS for the loader
        const style = document.createElement('style');
        style.innerHTML = `
    .loader,
    .loader:after {
        border-radius: 50%;
        width: 2vw;
        height: 2vw;
    }
    .loader {
        margin: 0 auto;
        position: relative;
        border-top: 0.2vw solid rgba(0, 0, 0, 0.2);
        border-right: 0.2vw solid rgba(0, 0, 0, 0.2);
        border-bottom: 0.2vw solid rgba(0, 0, 0, 0.2);
        border-left: 0.2vw solid #000000;
        transform: translateZ(0);
        animation: load8 1.1s infinite linear;
    }
    @keyframes load8 {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
        document.head.appendChild(style);

        // Attempt to respect content size while enforcing min/max dimensions
        const minWidth = window.innerWidth * 0.1;
        const maxWidth = Math.min(window.innerWidth * 0.5, 400); // Max width, but not more than 50% of viewport or 400px
        floatingDiv.style.maxWidth = `${maxWidth}px`;
        floatingDiv.style.minWidth = `${minWidth}px`;
        floatingDiv.style.wordWrap = 'break-word';
        floatingDiv.style.padding = '10px';
        document.body.offsetWidth; // Trigger reflow to ensure correct sizing

        // Adjusted styles after size calculation
        floatingDiv.style.visibility = ''; // Make visible again
        floatingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        // floatingDiv.style.border = '1px black';
        floatingDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        floatingDiv.style.borderRadius = '10px';
        floatingDiv.style.backgroundImage = 'linear-gradient(to right top, rgba(255,255,255,0.7), rgba(255,255,255,0.3))';
        floatingDiv.style.display = 'flex';
        floatingDiv.style.flexDirection = 'column';
        floatingDiv.style.justifyContent = 'center';
        floatingDiv.style.alignItems = 'center';

        // Position near selection
        let topPosition = window.scrollY + rect.top - floatingDiv.offsetHeight - 5;
        let leftPosition = window.scrollX + rect.left + (rect.width / 2) - (floatingDiv.offsetWidth / 2);

        // Adjust to prevent overflow
        if (topPosition < window.scrollY) topPosition = window.scrollY + rect.bottom + 5;
        if (leftPosition < 0) leftPosition = 0;
        else if (leftPosition + floatingDiv.offsetWidth > window.innerWidth) leftPosition = window.innerWidth - floatingDiv.offsetWidth;

        floatingDiv.style.top = `${topPosition}px`;
        floatingDiv.style.left = `${leftPosition}px`;

        // Remove the floating window after 10 seconds
        // setTimeout(() => floatingDiv.remove(), 10000);
    }
}
  
function createFloatingWindow(text) {
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (range) {
        const loadingWindow = document.getElementById('customLoadingWindow');
        loadingWindow.remove();
        const rect = range.getBoundingClientRect();
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'customFloatingWindow';
        document.body.appendChild(floatingDiv); // Append early to calculate dimensions

        // Basic style for size calculation
        floatingDiv.style.visibility = 'hidden'; // Hide while calculating size
        floatingDiv.style.position = 'absolute';
        floatingDiv.style.zIndex = '1000';

        floatingDiv.innerText = text; // Add text early to calculate size

        // Attempt to respect content size while enforcing min/max dimensions
        const minWidth = window.innerWidth * 0.1;
        const maxWidth = Math.min(window.innerWidth * 0.5, 400); // Max width, but not more than 50% of viewport or 400px
        floatingDiv.style.maxWidth = `${maxWidth}px`;
        floatingDiv.style.minWidth = `${minWidth}px`;
        floatingDiv.style.wordWrap = 'break-word';
        floatingDiv.style.padding = '10px';
        document.body.offsetWidth; // Trigger reflow to ensure correct sizing

        // Adjusted styles after size calculation
        floatingDiv.style.visibility = ''; // Make visible again
        floatingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        // floatingDiv.style.border = '1px black';
        floatingDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        floatingDiv.style.borderRadius = '10px';
        floatingDiv.style.backgroundImage = 'linear-gradient(to right top, rgba(255,255,255,0.7), rgba(255,255,255,0.3))';
        floatingDiv.style.display = 'flex';
        floatingDiv.style.flexDirection = 'column';
        floatingDiv.style.justifyContent = 'center';
        floatingDiv.style.alignItems = 'center';

        // Position near selection
        let topPosition = window.scrollY + rect.top - floatingDiv.offsetHeight - 5;
        let leftPosition = window.scrollX + rect.left + (rect.width / 2) - (floatingDiv.offsetWidth / 2);

        // Adjust to prevent overflow
        if (topPosition < window.scrollY) topPosition = window.scrollY + rect.bottom + 5;
        if (leftPosition < 0) leftPosition = 0;
        else if (leftPosition + floatingDiv.offsetWidth > window.innerWidth) leftPosition = window.innerWidth - floatingDiv.offsetWidth;

        floatingDiv.style.top = `${topPosition}px`;
        floatingDiv.style.left = `${leftPosition}px`;

        // Remove the floating window after 10 seconds
        // setTimeout(() => floatingDiv.remove(), 10000);
    }
}

document.addEventListener('click', checkForSelectionChange);
document.addEventListener('mouseup', checkForSelectionChange);
// document.addEventListener('selectionchange', checkForSelectionChange);



function checkForSelectionChange() {
    const selection = window.getSelection();
    const floatingWindow = document.getElementById('customFloatingWindow');
    floatingWindow.remove();

    // If there's no selection or the selection is collapsed (not selecting any text),
    // and the floating window exists, remove it.
    // if ((!selection || selection.isCollapsed) && floatingWindow) {
    //     floatingWindow.remove();
    // }
}