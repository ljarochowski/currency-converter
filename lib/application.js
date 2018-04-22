class Application {
    constructor(currencies, options = {}) {
        this.options = options;
        this.currencies = currencies;
        this.logger = {};
        this.forexService = {};
        this.highlighterService = {};
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

    async getForexService() {
        if (this.forexService instanceof Forex) {
            return this.forexService;
        }

        if (typeof Forex !== 'function') {
            fs = await require('./lib/forex.js');
            this.forexService = new fs(this.currencies);
        } else {
            this.forexService = new Forex(this.currencies);
        }

        return this.forexService;
    }

    async getHighlighterService() {
        if (this.highlighterService instanceof Highlighter) {
            return this.highlighterService;
        }

        if (typeof Highlighter !== 'function') {
            this.highlighterService = await require('./lib/highlighter.js');
        } else {
            this.highlighterService = Highlighter;
        }

        return this.highlighterService;
    }
}

module.exports = Application;
