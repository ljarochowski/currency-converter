var forexService, highlighterService;
main();

async function main() {
    if (typeof Forex !== 'function') {
        fs = await require('./lib/forex.js');
        forexService = new fs('usd', 'gbp', 'eur');
    } else {
        forexService = new Forex('usd', 'gbp', 'eur');
    }

    if (typeof Highlighter !== 'function') {
        highlighterService = await require('./lib/highlighter.js');
    } else {
        highlighterService = Highlighter;
    }

    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request.action === 'doCurrencyConversion') {
                forexService.loadExchangeRates(request.rates);
                run();
            }
        }
    );
}

async function run() {
    let highlighter = new highlighterService(document.body);
    await highlighter.highlight(async (value, currency) => {
        return forexService.convert(value, currency, 'pln');
    });

    highlighter.save();
}
