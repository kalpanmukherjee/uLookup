// const ANTHROPIC_API_KEY = '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'; // Replace with your actual API key

var contextMenuItem = {
    "id": "ULookUp",
    "title": "ULookUp \"%s\"",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);

// Define the data to be sent in the request

async function callAnthropicAPI(context, prompt) {

    // await chrome.storage.sync.get('apiKey', function(data) {
    //     // console.log('API Key retrieved:', data.apiKey);
    //     ANTHROPIC_API_KEY = data.apiKey;
    //     console.log(typeof ANTHROPIC_API_KEY)
    //     ANTHROPIC_API_KEY = JSON.stringify(ANTHROPIC_API_KEY);
    //     console.log(typeof ANTHROPIC_API_KEY)
    //     // console.log(ANTHROPIC_API_KEY)
    //     // You can now use data.apiKey in your API calls
    // });
    // console.log("out", typeof ANTHROPIC_API_KEY)

    let ANTHROPIC_API_KEY = null;

    const getApiKey = () => new Promise((resolve, reject) => {
        chrome.storage.sync.get('apiKey', function (data) {
            if (chrome.runtime.lastError) {
                // If there's an error, reject the promise
                reject(chrome.runtime.lastError);
            } else {
                // Resolve the promise with the value
                resolve(data.apiKey);
            }
        });
    });

    try {
        // Await the promise to get the API key
        ANTHROPIC_API_KEY = await getApiKey();
        ANTHROPIC_API_KEY = JSON.stringify(ANTHROPIC_API_KEY);
        ANTHROPIC_API_KEY = ANTHROPIC_API_KEY.slice(1, -1);;
    } catch (error) {
        console.error('Failed to retrieve the API key:', error);
        // Handle the error (e.g., show a message to the user)
    }

    var promptWithContext = "<context>" + context + "</context>" + "<word>" + prompt + "</word>" +
        "Given the context, define the given word in a wikipedia manner, very short, under 50 words.";

    console.log("Prompting the LLM with the following prompt:", promptWithContext);

    const data = {
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: "",
        messages: [
            {
                "role": "user",
                "content": promptWithContext
            }
        ]
    };
    let response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', // HTTP method
        headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
      });
      response = await response.json();
      console.log(response['type'])
      if(response['type']=="message"){
        return response['content'][0]['text']
      }
      else{
        return "Please add/update your API key!"
      }
    //   if(response['type'])
    //   console.log(response)
    //   console.log("from function ", response['content'][0]['text'])
     
}


// Function to request text content from the content script
function requestTextContentFromContentScript(selectedText) {
    return new Promise(function (resolve, reject) {
        // Query for the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            // Send a message to the content script to request text content
            chrome.tabs.sendMessage(tabs[0].id, { requestTextContent: true }, async function (response) {
                // Call LLM API with the retrieved text content
                if (response && response.textContent) {
                    try {
                        const llmResponse = await callAnthropicAPI(response.textContent, selectedText);
                        resolve(llmResponse);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error("Failed to retrieve text content"));
                }
            });
        });
    });
}


chrome.contextMenus.onClicked.addListener(async (clickData, tab) => {
    if (clickData.menuItemId == "ULookUp" && clickData.selectionText) {
        console.log("Selected text:", clickData.selectionText);
        chrome.tabs.sendMessage(tab.id, { action: "showLoadingWindow", text: clickData.selectionText });
        requestTextContentFromContentScript(clickData.selectionText)
            .then(function (llmResponse) {
                console.log("LLM response:", llmResponse);
                chrome.tabs.sendMessage(tab.id, { action: "showFloatingWindow", text: llmResponse });
            })
            .catch(function (error) {
                console.error("Error:", error.message);
            });
    }
})