class Forex {
    constructor(...currencies) {
        if (currencies.length === 0) {
            throw Error('no currencies set');
        }
        this.currencyISOnames = {
            '€': 'eur',
            '£': 'gbp',
            '$': 'usd',
            'zł': 'pln',
        };
        this.currencies = Array.from(currencies);
        this.currencies.push('pln');
        this.currencies.map(this.getISOcode.bind(this));

        this.forexURL = '//api.nbp.pl/api/exchangerates/rates/a'
        this.cacheTimeStamp = Date.now();
        this.ttl = 4 * 3600;
        this.exchange = {};
    }

    getISOcode(symbol) {
        if (this.currencyISOnames[symbol] !== undefined) {
            return this.currencyISOnames[symbol];
        }
        return symbol;
    }

    async loadExchangeRates() {
        if (!this.hasFXexpired()) {
            return this;
        }

        for (let i in this.currencies) {
            let currency = this.currencies[i];
            this.exchange[currency] = await getRate(currency);
        }

        return this;
    }

    async convert(amount, from, to) {
        from = this.getISOcode(from);
        to = this.getISOcode(to);
        let rate = await this.getConversionRate(from, to);
        return Math.round(100 * amount * rate, 2) / 100;
    }

    async getConversionRate(from, to) {
        from = this.getISOcode(from).toLowerCase();
        to = this.getISOcode(to).toLowerCase();
        if (this.currencies.indexOf(from) === -1
            && this.currencies.indexOf(to) === -1) {

            throw Error('no valid currency found, valid are: ' + this.currencies);
        }

        if (from === 'pln') {
            let rate = await this.getRate(to);
            return 1 / rate;
        }

        let rate = await this.getRate(from);
        return rate;
    }

    async getRate(currency) {
        let url = `${this.forexURL}/${currency}/`;
        let resp = await fetch(url);
        let json = await resp.json();
        return json.rates.pop().mid;
    }

    hasFXexpired() {
        return Date.now() - this.cacheTimeStamp > this.ttl;
    }
}


module.exports = Forex;
