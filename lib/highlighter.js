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
        const search = /(<span class="__converted_currency_highlight">)?(([€£$])((\d+)([.,](\d{2}))?))\b/g;
        let matches;
        let temp = this.compiled;
        while (matches = search.exec(this.compiled)) {
            if (matches[1] !== undefined) continue;
            let match = matches[2];
            let currency = matches[3];
            let value = matches[4].replace(',', '.') * 1;

            let to = await convert.call({}, value, currency);
            temp = temp.replace(matches[0], this.create(match, to));
        }
        this.compiled = temp;
    }

    save() {
        this.node.innerHTML = this.compiled;
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
        for (let i in elements) {
            let highlightedElement = new HighlightedElement(elements[i]);
            highlightedElement.activate();
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
            element.appendChild(p.toDOM());
        }

        this.element = element;
    }

    activate() {
        let collection = Array.from(this.element.getElementsByClassName(ELEMENT_BOX_CLASS));
        let popup = new Popup(collection.pop());

        this.element.addEventListener('mouseover', popup.toggle.bind(popup));
        this.element.addEventListener('mouseout', popup.toggle.bind(popup));
        this.element.addEventListener('mousemove', (e) => {
            popup.moveTo(e.layerX, e.layerY);
        });

    }

    toString() {
        return this.element.outerHTML;
    }
}

class Popup {
    constructor(text) {
        this.boxStyles = {
            display: 'none',
            position: 'absolute',
            'z-index': '100000',
            background: 'white',
            border: '1px solid #ddd',
            'border-radius': '5px',
            'box-shadow': '3px 3px #ddd',
            padding: '10px',
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
            styleAttribute += `${i}:${styles[i]};`;
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

    toDOM() {
        return this.element;
    }
}
module.exports = Highlighter;
