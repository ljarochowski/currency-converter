class Application {
    constructor(currencies, options = {}) {
        this.options = options;
        this.currencies = currencies;
        this.logger = {};
        this.forexService = {};
        this.highlighterService = {};
    }

    async _loadClass(className, ...constructorArguments) {
        let fn;
        if (typeof window[className] !== 'function') {
            console.log(className);
            fn = await require(`./lib/${className.toLowerCase()}.js`);
        } else {
            fn = window[className];
        }
        console.log(fn, constructorArguments);

        return new fn(constructorArguments);
    }

    async getLogger() {
        if (this.logger instanceof Logger) {
            return this.logger;
        }

        if (this.options.debug === true) {
            if (typeof Logger !== 'function') {
                this.logger = await require('./lib/logger.js');
            } else {
                this.logger = new Logger();
            }
        } else {
            if (typeof NullLogger !== 'function') {
                this.logger = await require('./lib/null-logger.js');
            } else {
                this.logger = new NullLogger();
            }
        }

        return this.logger;
    }

    async getForexService(rates) {
        if (this.forexService instanceof Forex) {
            return this.forexService;
        }

        let ForexServiceFn;
        if (typeof Forex !== 'function') {
            ForexServiceFn = await require('./lib/forex.js');
        } else {
            ForexServiceFn = Forex;
        }
        this.forexService = new ForexServiceFn(this.currencies);

        await this.forexService.loadExchangeRates(rates);

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

        let HighlighterServiceFn;
        if (typeof Highlighter !== 'function') {
            HighlighterServiceFn = await require('./lib/highlighter.js');
        } else {
            HighlighterServiceFn = Highlighter;
        }

        this.highlighterService = new HighlighterServiceFn(domElement);

        return this.highlighterService;
    }
}

module.exports = Application;
