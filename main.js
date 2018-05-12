main();

async function main() {
    const app = await new Application(['usd', 'gbp', 'eur']);
    const serialized = await app.serialize();

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        chrome.tabs.sendMessage(tabId, {
            action: 'doCurrencyConversion',
            application: serialized,
        });
    });
};
