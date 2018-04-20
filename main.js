document.addEventListener('DOMContentLoaded', main);

async function main() {
    let DEBUG = true;
    let logger;

    if (DEBUG) {
        logger = await require('./lib/logger.js');
    } else {
        logger = await require('./lib/null-logger.js');
    }

    let forexService = new (await require('./lib/forex.js'))('usd', 'gbp', 'eur');
    await forexService.loadExchangeRates();

    let highlighter = new (await require('./lib/highlighter.js'))(document.body);

    const search = /([€,£,$])((\d+)([.,](\d{2}))?)\b/g;
    while (matches = search.exec(document.body.innerHTML)) {
        let match = matches[0];
        let currency = matches[1];
        let value = matches[2].replace(',', '.') * 1;

        let converted = await forexService.convert(value, currency, 'pln');
        highlighter.highlight(match, converted);
    }
    highlighter.replace();
};
