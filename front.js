main();

async function main() {
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request.action === 'doCurrencyConversion') {
                run(Application.unserialize(request.application));
            }
        }
    );
}

async function run(application) {
    const forexService = await application.getForexService();
    const highlighter = await application.getHighlighterService(document.body);

    await highlighter.highlight(async (value, currency) => {
        if (/^[,.]$/.test(`${value}`.substr(-3, 1))) {
            value = +(`${value}`.slice(0, -3).replace(/[ ,.]/g, '')
                + '.' + `${value}`.slice(-2));
        } else {
            value = +(`${value}`.replace(/[ ,.]/g, ''));
        }

        return forexService.convert(value, currency, 'pln');
    });

    highlighter.save();
}
