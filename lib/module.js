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
