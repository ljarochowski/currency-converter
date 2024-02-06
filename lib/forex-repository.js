class ForexRepository {
  constructor() {
  }

  async getRate(currency) {
  }
}

class ForexRepositoryNBP extends ForexRepository {
  constructor() {
    super();
    this.forexURL = 'https://api.nbp.pl/api/exchangerates/rates/a';
  }

  async getRate(currency) {
    if (currency === 'pln') {
      return 1;
    }

    const url = `${this.forexURL}/${currency}/`;
    const resp = await fetch(url);
    const json = await resp.json();
    return +json.rates.pop().mid;
  }
}

module.exports = ForexRepositoryNBP;
