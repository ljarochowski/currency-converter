
var module = module || {
    exports: {},
};

class RequireBrowser {  
    constructor(params) {
        for (let i in params) {
            this[i] = params[i];
        }
        
        if (this.isRequireScriptValid() === false) {
            this.requireScript = (src) => {
                let container = document.createElement('script');
                container.text = src;
                document.head.appendChild(container);
                let result = __module;
                __module = null;

                return result;
            }
        }

        if (this.isGetPathValid() === false) {
            this.getPath = (path) => path;
        }
    }

    async require(file) {
        file = this.getPath(file);
        console.log('path: ' + file);
        if (file === null || file === undefined) {
            throw Error('no file defined');
        }
        let response = await fetch(file);
        if (!response.ok) {
            throw Error(`file: ${file} doesn't exist!`);
        }

        let src = await response.text();
        src = `var __module = (function(){
            var module = module || {exports: {}};
            ${src};
            return module.exports;
        })()`;

        return this.requireScript(src);
    }

    isRequireScriptValid() {
        return this.requireScript instanceof Function;
    }

    isGetPathValid() {
        return this.getPath instanceof Function;
    }
}

if (!(require instanceof Function)) {
    var reqBrowser = new RequireBrowser();
    function require(file) {
        return reqBrowser.require(file);
    }
}
var reqBrowser = new RequireBrowser({
    getPath: (path) => {
        path = chrome.runtime.getURL(path);
        return path;
    },
});
function require(file) {
    return reqBrowser.require(file);
}
class Logger {
    constructor() {
        return (...what) => {
            console.log(...what);
        };
    }
}

module.exports = new Logger();
class NullLogger {
    constructor() {
        return (...what) => {};
    }
}

module.exports = new NullLogger();
class Forex {
    constructor(...currencies) {
        if (currencies instanceof Array
            && currencies.length === 1) {
            [...currencies] = currencies[0];
        }

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

        this.forexURL = 'https://api.nbp.pl/api/exchangerates/rates/a';
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

    async loadExchangeRates(rates) {
        if (rates instanceof Object) {
            this.exchange = rates;
            this.cacheTimeStamp = Date.now();

            return this;
        }

        if (!this.hasFXexpired()) {
            return this;
        }

        for (let i in this.currencies) {
            if (i in this.currencies) {
                let currency = this.currencies[i];
                this.exchange[currency] = await this.getRate(currency);
            }
        }
        this.cacheTimeStamp = Date.now();

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
            throw Error('no valid currency found, valid are: '
                + this.currencies);
        }

        if (from === 'pln') {
            let rate = await this.getRate(to);
            return 1 / rate;
        }

        let rate = await this.getRate(from);
        return rate;
    }

    async getRate(currency) {
        let rate = 1;

        if (currency === 'pln') {
            return rate;
        } else if (this.hasFXexpired()
            || this.exchange[currency] === undefined) {
            let url = `${this.forexURL}/${currency}/`;
            let resp = await fetch(url);
            let json = await resp.json();
            rate = json.rates.pop().mid;
        } else {
            rate = this.exchange[currency];
        }

        return rate;
    }

    getRates() {
        return this.exchange;
    }

    hasFXexpired() {
        return Date.now() - this.cacheTimeStamp < this.ttl;
    }
}


module.exports = Forex;
const ELEMENT_CLASS = '__converted_currency_highlight';
const ELEMENT_BOX_CLASS = '__converted_currency_popup';

class Highlighter {
    constructor(node) {
        if (node instanceof HTMLElement) {
            this.node = node;
            this.compiled = this.node.innerHTML;
        } else {
            this.compiled = `${node}`;
        }
    }

    async highlight(convert) {
        const search = /([€£$])((?:\d+[ .,]?)+(?:[.,](?:\d{2}))?)\b/g;
        let conversions = new Map();

        // first pass - search for tokens to replace
        let matches;
        let match;
        let currency;
        let amount;
        while (matches = search.exec(this.node.innerHTML)) {
            [match, currency, amount] = matches;
            let converted = await convert.call({}, amount, currency);
            conversions.set(match, converted);
        }

        // second pass, substitution
        for (let [match, converted] of conversions) {
            let xpath = document.evaluate('//text()[contains(., "'+match+'")]',
                this.node, null,
                XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            let nodesToReplace = [];
            let xFound;

            while (xFound = xpath.iterateNext()) {
                let xElement = xFound.parentElement;
                if (xElement.getAttribute('class') === ELEMENT_CLASS) {
                    continue;
                }

                nodesToReplace.push(xElement);
            }

            nodesToReplace.forEach((xElement) => {
                xElement.innerHTML =xElement.innerHTML.replace(
                    match, this.create(match, converted));
            });
        }
    }

    save() {
        this.activateHighlightedElements(this.node);
    }

    toString() {
        return this.compiled;
    }

    create(what, text) {
        let element = new HighlightedElement(what, text);
        return element;
    }

    activateHighlightedElements(where) {
        let elements = where.getElementsByClassName(ELEMENT_CLASS);
        for (let element of elements) {
            (new HighlightedElement(element)).activate();
        }
    }
}

class HighlightedElement {
    constructor(what, text) {
        let element;
        if (what instanceof HTMLElement) {
            element = what;
        } else {
            element = document.createElement('span');
            element.setAttribute('class', ELEMENT_CLASS);
            element.innerText = what;
        }

        if (element.getElementsByClassName(ELEMENT_BOX_CLASS).length === 0) {
            let p = new Popup(text);
            element.appendChild(p.toDOMElement());
        }

        this.element = element;
    }

    activate() {
        let collection = Array.from(
            this.element.getElementsByClassName(ELEMENT_BOX_CLASS));
        let popup = new Popup(collection.pop());

        this.element.addEventListener('mouseover', popup.toggle.bind(popup));
        this.element.addEventListener('mouseout', popup.toggle.bind(popup));
        this.element.addEventListener('mousemove', (e) => {
            popup.moveTo(e.layerX, e.layerY);
        });
    }

    toDOMElement() {
        return this.element;
    }

    toString() {
        return this.element.outerHTML;
    }
}

class Popup {
    constructor(text) {
        this.boxStyles = {
            'display': 'none',
            'position': 'absolute',
            'z-index': '100000',
            'background': 'white',
            'border': '1px solid #ddd',
            'border-radius': '5px',
            'box-shadow': '3px 3px #ddd',
            'padding': '10px',
        };

        if (text instanceof HTMLElement) {
            this.element = text;
        } else {
            text = `${text}`;
            this.element = document.createElement('div');
            this.element.setAttribute('class', ELEMENT_BOX_CLASS);
            this.element.setAttribute('style', this.getStyle(this.boxStyles));
            this.element.innerText = text.replace('.', ',') + ' PLN';
        }
    }

    getStyle(styles) {
        let styleAttribute = '';
        for (let i in styles) {
            if (i in styles) {
                styleAttribute += `${i}:${styles[i]};`;
            }
        }

        return styleAttribute;
    }

    updateStyles(styles) {
        this.element.setAttribute('style', this.getStyle(styles));
    }

    toggle() {
        let styles = this.boxStyles;
        styles.display = styles.display === 'block'? 'none' : 'block';
        this.updateStyles(styles);
    }

    moveTo(x, y) {
        let styles = this.boxStyles;
        styles.top = `${y}px`;
        styles.left = `${x}px`;
        this.updateStyles(styles);
    }

    toDOMElement() {
        return this.element;
    }
}
module.exports = Highlighter;
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
            this.forexService = new Forex(this.currencies);
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
