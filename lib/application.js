let Logger = require('./logger.js');
let NullLogger = require('./null-logger.js');
let Forex = require('./forex.js');
let Highlighter = require('./highlighter.js');

class Application {
    constructor(currencies, rates, options = {}) {
        this.options = options || {};
        this.currencies = currencies || [];
        this.rates = rates;
        this.logger = {};
        this.forexService = {};
        this.highlighterService = {};
    }

    async getLogger() {
        if (this.logger instanceof Logger
        || this.logger instanceof NullLogger) {
            return this.logger;
        }

        if (this.options.debug === true) {
            this.logger = new Logger();
        } else {
            this.logger = new NullLogger();
        }

        return this.logger;
    }

    async getForexService() {
        if (this.forexService instanceof Forex) {
            return this.forexService;
        }

        try {
            this.forexService = new Forex(this.currencies);
            await this.forexService.loadExchangeRates(this.rates);
        } catch (err) {
            throw err;
        }

        return this.forexService;
    }

    async getHighlighterService(domElement) {
        if (this.highlighterService instanceof Highlighter) {
            return this.highlighterService;
        }

        this.highlighterService = new Highlighter(domElement);

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
