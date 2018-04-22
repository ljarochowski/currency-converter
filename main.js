main();

async function main() {
    let app = await new Application(['usd', 'gbp', 'eur']);
    // let logger = await app.getLogger();
    let forexService = await app.getForexService();

    await forexService.loadExchangeRates();

    let refreshTab = (tabId) => {
        chrome.tabs.sendMessage(tabId, {
            action: 'doCurrencyConversion',
            rates: forexService.getRates(),
        });
    };

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        return refreshTab(tabId);
    });
};
