async function _loadClass(className, ...constructorArguments) {
    let Fn;

    if (typeof className !== 'function') {
        const fileName = className.name
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();
        Fn = await require(`./lib/${fileName}.js`);
    } else {
        Fn = className;
    }

    return new Fn(...constructorArguments);
}

class Application {
    constructor(currencies, rates, options = {}) {
        this.options = options;
        this.currencies = currencies;
        this.rates = rates;
        this.logger = {};
        this.forexService = {};
        this.highlighterService = {};
    }

    async getLogger() {
        if (this.logger instanceof Logger) {
            return this.logger;
        }

        if (this.options.debug === true) {
            this.logger = await _loadClass(Logger);
        } else {
            this.logger = await _loadClass(NullLogger);
        }

        return this.logger;
    }

    async getForexService() {
        if (this.forexService instanceof Forex) {
            return this.forexService;
        }

        this.forexService = await _loadClass(Forex, this.currencies);

        if (this.rates !== null) {
            await this.forexService.loadExchangeRates(this.rates);
        }

        return this.forexService;
    }

    async getHighlighterService(domElement) {
        if (this.highlighterService instanceof Highlighter) {
            return this.highlighterService;
        }

        if (! (domElement instanceof HTMLElement)) {
            throw Error(`Highlighter Service has to be attached to a DOMElement,
                ${typeof domElement} provided instead`);
        }

        this.highlighterService = await _loadClass(Highlighter, domElement);

        return this.highlighterService;
    }

    async serialize() {
        return Object.freeze({
            rates: (await this.getForexService()).getRates(),
            options: this.options,
            currencies: this.currencies,
        });
    }

    static unserialize(data) {
        return new Application(data.currencies, data.rates, data.options);
    }
}

module.exports = Application;
