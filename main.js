main();

async function main() {
    let app = await new Application(['usd', 'gbp', 'eur']);
    // let logger = await app.getLogger();
    let forexService = await app.getForexService();

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        chrome.tabs.sendMessage(tabId, {
            action: 'doCurrencyConversion',
            rates: forexService.getRates(),
        });
    });
};
