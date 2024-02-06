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
    const conversions = new Map();

    // first pass - search for tokens to replace
    let matches;
    let match;
    let currency;
    let amount;
    while (matches = search.exec(this.node.innerHTML)) {
      [match, currency, amount] = matches;
      const converted = await convert.call({}, amount, currency);
      conversions.set(match, converted);
    }

    // second pass, substitution
    for (const [match, converted] of conversions) {
      const xpath = document.evaluate('//text()[contains(., "'+match+'")]',
          this.node, null,
          XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      const nodesToReplace = [];
      let xFound;

      while (xFound = xpath.iterateNext()) {
        const xElement = xFound.parentElement;
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
    const element = new HighlightedElement(what, text);
    return element;
  }

  activateHighlightedElements(where) {
    const elements = where.getElementsByClassName(ELEMENT_CLASS);
    for (const element of elements) {
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
      const p = new Popup(text);
      element.appendChild(p.toDOMElement());
    }

    this.element = element;
  }

  activate() {
    const collection = Array.from(
        this.element.getElementsByClassName(ELEMENT_BOX_CLASS));
    const popup = new Popup(collection.pop());

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
    for (const i in styles) {
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
    const styles = this.boxStyles;
    styles.display = styles.display === 'block'? 'none' : 'block';
    this.updateStyles(styles);
  }

  moveTo(x, y) {
    const styles = this.boxStyles;
    styles.top = `${y}px`;
    styles.left = `${x}px`;
    this.updateStyles(styles);
  }

  toDOMElement() {
    return this.element;
  }
}
module.exports = Highlighter;
