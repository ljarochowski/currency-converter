const Logger = require('./logger.js');
const NullLogger = require('./null-logger.js');
const {Forex, CachedForex} = require('./forex.js');
const ForexRepositoryNBP = require('./forex-repository.js');
const Highlighter = require('./highlighter.js');

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
            this.forexService = new CachedForex(new ForexRepositoryNBP(),
                this.currencies);
            await this._loadExchangeRates();
        } catch (err) {
            throw err;
        }

        return this.forexService;
    }

    async _loadExchangeRates() {
        return this.forexService.loadExchangeRates(this.rates);
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
