chrome.tabs.onActivated.addListener((tabId, changeInfo, tab) => {
    console.log(chrome.runtime.id, chrome.runtime.getURL('./lib/module.js'));
        // var message = {action: 'extensionOn', customerArray: MSTR.Service.getTokenList() };
        // chrome.tabs.sendMessage(tabId, message);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getURL': {
            fetch(request.resource).then((response) => {
                console.log(response);
                sendResponse('dupa');
                // response.text();
            })
            // .then(sendResponse.bind(sendResponse))
            .catch(console.log.bind(console));
            // if (!response.ok) {
            //     throw Error(`file: ${file} doesn't exist!`);
            // }

            // let src = await response.text();
            // sendResponse(src);
            break;
        }
        default:
            break;
    }
});

