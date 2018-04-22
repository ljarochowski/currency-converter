main();

async function main() {
    const app = await new Application(['usd', 'gbp', 'eur']);
    // const logger = await app.getLogger();

    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request.action === 'doCurrencyConversion') {
                run(app, request.rates);
            }
        }
    );
}

async function run(application, rates) {
    const forexService = await application.getForexService();
    await forexService.loadExchangeRates(rates);

    const HighlighterService = await application.getHighlighterService();
    const highlighter = new HighlighterService(document.body);
    await highlighter.highlight(async (value, currency) => {
        return forexService.convert(value, currency, 'pln');
    });

    highlighter.save();
}
