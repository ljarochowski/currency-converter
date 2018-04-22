main();

async function main() {
    let DEBUG = true;
    let logger, forexService, highlighter;

    if (DEBUG) {
        if (typeof Logger !== 'function') {
            logger = await require('./lib/logger.js');
        } else {
            logger = new Logger();
        }
    } else {
        if (typeof NullLogger !== 'function') {
            logger = new NullLogger();
        } else {
            logger = await require('./lib/null-logger.js');
        }
    }

    if (typeof Forex !== 'function') {
        forexService = new (await require('./lib/forex.js'))('usd', 'gbp', 'eur');
    } else {
        forexService = new Forex('usd', 'gbp', 'eur');
    }
    await forexService.loadExchangeRates();

    let refreshTab = (tabId) => {
        chrome.tabs.sendMessage(tabId, {
            action: 'doCurrencyConversion',
            rates: forexService.getRates(),
        });
    };

    chrome.tabs.onActivated.addListener((activeInfo) => {
        // return refreshTab(activeInfo.tabId);
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        return refreshTab(tabId);
    });
};
