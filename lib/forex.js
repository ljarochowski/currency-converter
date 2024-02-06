const fetch = require('cross-fetch');

class Forex {
  constructor(forexRepository, ...currencies) {
    if (currencies[0] instanceof Array) {
      [...currencies] = currencies[0];
    } else {
      [...currencies] = currencies;
    }

    if (currencies.length === 0) {
      throw Error('no currencies set');
    }
    this.currencyRepository =
            new CurrencyRepository(Array.from(currencies));
    this.currencies = this.currencyRepository.getCurrencies();
    this.forexRepository = forexRepository;
    this.exchange = {};
  }

  async loadExchangeRates(rates) {
    for (const i in this.currencies) {
      if (i in this.currencies) {
        const currency = this.currencies[i];
        if (rates instanceof Object && rates[currency] !== null) {
          this.addRate(currency, rates[currency]);
        } else {
          this.addRate(currency, await this.getRate(currency));
        }
      }
    }

    return this;
  }

  async convert(amount, from, to) {
    from = this.currencyRepository.getISOcode(from);
    to = this.currencyRepository.getISOcode(to);
    const rate = await this.getConversionRate(from, to);
    return Math.round(100 * amount * rate, 2) / 100;
  }

  async getConversionRate(from, to) {
    from = this.currencyRepository.getISOcode(from);
    to = this.currencyRepository.getISOcode(to);

    const fromRate = await this.getRate(from);
    if (fromRate === null) {
      throw Error(`currency ${from} unknown`);
    }
    const toRate = await this.getRate(to);
    if (toRate === null) {
      throw Error(`currency ${to} unknown`);
    }

    return fromRate / toRate;
  }

  addRate(currency, rate) {
    this.exchange[currency] = rate;
    return this;
  }

  async getRate(currency) {
    try {
      this.addRate(currency,
          await this.forexRepository.getRate(currency));
    } catch (error) {
      this.addRate(currency, null);
    }

    return this.exchange[currency];
  }

  getRates() {
    return this.exchange;
  }
}

class CachedForex extends Forex {
  constructor(...currencies) {
    super(...currencies);
    this.cacheTimeStamp = 0;
    this.currencyCacheTimeStamp = {};
    this.ttl = 4 * 3600;
  }

  addRate(currency, rate) {
    this.currencyCacheTimeStamp[currency] = Date.now();
    this.cacheTimeStamp = Date.now();
    return super.addRate(currency, rate);
  }

  async loadExchangeRates(rates) {
    this.cacheTimeStamp = Date.now();
    return super.loadExchangeRates(rates);
  }

  async getRate(currency) {
    if (!this.hasFXexpired(currency) &&
            this.exchange[currency] !== undefined) {
      return this.exchange[currency];
    }

    return super.getRate(currency);
  }

  hasFXexpired(currency) {
    let timeStamp;
    if (currency !== undefined) {
      timeStamp = Math.min(this.currencyCacheTimeStamp[currency],
          this.cacheTimeStamp);
    } else {
      timeStamp = this.cacheTimeStamp;
    }
    return Date.now() - timeStamp > this.ttl;
  }
}

class CurrencyRepository {
  constructor(currencies) {
    this.currencyISOnames = {
      '€': 'eur',
      '£': 'gbp',
      '$': 'usd',
      'zł': 'pln',
    };
    this.currencies =
            currencies.map(this.getISOcode.bind(this));
  }

  getISOcode(symbol) {
    symbol = `${symbol}`.toLowerCase();
    if (this.currencyISOnames[symbol] !== undefined) {
      return this.currencyISOnames[symbol];
    }
    return symbol;
  }

  getCurrencies() {
    return this.currencies;
  }
}

module.exports = {Forex, CachedForex};
