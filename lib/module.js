var module = module || {
    exports: {},
};

if (typeof require != 'function') {
    var require = async function require(file) {
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
        })();`;

        let container = document.createElement('script');
        container.text = src;
        document.head.appendChild(container);
        let result = __module;
        __module = null;

        return result;
    };
}
