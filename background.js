const ANTHROPIC_API_KEY = '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'; // Replace with your actual API key

var contextMenuItem = {
    "id": "ULookUp",
    "title": "ULookUp \"%s\"",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);

// Define the data to be sent in the request

async function callAnthropicAPI(prompt) {
    const data = {
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: "Respond in a wikipedia manner, very short, under 50 words",
        messages :[
            {"role": "user", "content": prompt}
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
    //   console.log("from function ", response['content'][0]['text'])
      return response['content'][0]['text']
    //   .then(response => response.json()) // Parse the JSON response
    //   .then(data => {return data['content'][0]['text']}) // Log the response data
    //   .catch(error => console.error('Error:', error)); // Log any errors
}


chrome.contextMenus.onClicked.addListener(async (clickData, tab) => {
    if(clickData.menuItemId == "ULookUp" && clickData.selectionText){
        console.log(clickData.selectionText)
        // chrome.windows.create({url : "hello.html"}); 
        chrome.tabs.sendMessage(tab.id, { action: "showLoadingWindow", text: clickData.selectionText });
        const response = await callAnthropicAPI(clickData.selectionText)
        console.log(response)
        chrome.tabs.sendMessage(tab.id, { action: "showFloatingWindow", text: response });
    }
})