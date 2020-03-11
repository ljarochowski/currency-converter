!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=7)}([function(e,t,r){const n=r(1),i=r(2),{Forex:o,CachedForex:s}=r(3),a=r(5),c=r(6);class h{constructor(e,t,r={}){this.options=r||{},this.currencies=e||[],this.rates=t,this.logger={},this.forexService={},this.highlighterService={}}async getLogger(){return this.logger instanceof n||this.logger instanceof i||(!0===this.options.debug?this.logger=new n:this.logger=new i),this.logger}async getForexService(){if(this.forexService instanceof o)return this.forexService;try{this.forexService=new s(new a,this.currencies),await this._loadExchangeRates()}catch(e){throw e}return this.forexService}async _loadExchangeRates(){return this.forexService.loadExchangeRates(this.rates)}async getHighlighterService(e){return this.highlighterService instanceof c||(this.highlighterService=new c(e)),this.highlighterService}async serialize(){return Object.freeze({rates:(await this.getForexService()).getRates(),options:this.options,currencies:this.currencies})}static unserialize(e){return new h(e.currencies,e.rates,e.options)}}e.exports=h},function(e,t){e.exports=class{log(...e){console.log(...e)}}},function(e,t){e.exports=class{log(...e){}}},function(e,t,r){r(4);class n{constructor(e,...t){if(t[0]instanceof Array?[...t]=t[0]:[...t]=t,0===t.length)throw Error("no currencies set");this.currencyRepository=new i(Array.from(t)),this.currencies=this.currencyRepository.getCurrencies(),this.forexRepository=e,this.exchange={}}async loadExchangeRates(e){for(let t in this.currencies)if(t in this.currencies){const r=this.currencies[t];e instanceof Object&&null!==e[r]?this.addRate(r,e[r]):this.addRate(r,await this.getRate(r))}return this}async convert(e,t,r){t=this.currencyRepository.getISOcode(t),r=this.currencyRepository.getISOcode(r);let n=await this.getConversionRate(t,r);return Math.round(100*e*n,2)/100}async getConversionRate(e,t){e=this.currencyRepository.getISOcode(e),t=this.currencyRepository.getISOcode(t);let r=await this.getRate(e);if(null===r)throw Error(`currency ${e} unknown`);let n=await this.getRate(t);if(null===n)throw Error(`currency ${t} unknown`);return r/n}addRate(e,t){return this.exchange[e]=t,this}async getRate(e){try{this.addRate(e,await this.forexRepository.getRate(e))}catch(t){this.addRate(e,null)}return this.exchange[e]}getRates(){return this.exchange}}class i{constructor(e){this.currencyISOnames={"€":"eur","£":"gbp",$:"usd","zł":"pln"},this.currencies=e.map(this.getISOcode.bind(this))}getISOcode(e){return e=`${e}`.toLowerCase(),void 0!==this.currencyISOnames[e]?this.currencyISOnames[e]:e}getCurrencies(){return this.currencies}}e.exports={Forex:n,CachedForex:class extends n{constructor(...e){super(...e),this.cacheTimeStamp=0,this.currencyCacheTimeStamp={},this.ttl=14400}addRate(e,t){return this.currencyCacheTimeStamp[e]=Date.now(),this.cacheTimeStamp=Date.now(),super.addRate(e,t)}async loadExchangeRates(e){return this.cacheTimeStamp=Date.now(),super.loadExchangeRates(e)}async getRate(e){return this.hasFXexpired(e)||void 0===this.exchange[e]?super.getRate(e):this.exchange[e]}hasFXexpired(e){let t;return t=void 0!==e?Math.min(this.currencyCacheTimeStamp[e],this.cacheTimeStamp):this.cacheTimeStamp,Date.now()-t>this.ttl}}}},function(e,t,r){var n=function(e){function t(){this.fetch=!1}return t.prototype=e,new t}("undefined"!=typeof self?self:this);(function(e){!function(e){if(!e.fetch){var t="URLSearchParams"in e,r="Symbol"in e&&"iterator"in Symbol,n="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),i="FormData"in e,o="ArrayBuffer"in e;if(o)var s=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],a=function(e){return e&&DataView.prototype.isPrototypeOf(e)},c=ArrayBuffer.isView||function(e){return e&&s.indexOf(Object.prototype.toString.call(e))>-1};f.prototype.append=function(e,t){e=l(e),t=d(t);var r=this.map[e];this.map[e]=r?r+","+t:t},f.prototype.delete=function(e){delete this.map[l(e)]},f.prototype.get=function(e){return e=l(e),this.has(e)?this.map[e]:null},f.prototype.has=function(e){return this.map.hasOwnProperty(l(e))},f.prototype.set=function(e,t){this.map[l(e)]=d(t)},f.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},f.prototype.keys=function(){var e=[];return this.forEach((function(t,r){e.push(r)})),p(e)},f.prototype.values=function(){var e=[];return this.forEach((function(t){e.push(t)})),p(e)},f.prototype.entries=function(){var e=[];return this.forEach((function(t,r){e.push([r,t])})),p(e)},r&&(f.prototype[Symbol.iterator]=f.prototype.entries);var h=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];x.prototype.clone=function(){return new x(this,{body:this._bodyInit})},w.call(x.prototype),w.call(_.prototype),_.prototype.clone=function(){return new _(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},_.error=function(){var e=new _(null,{status:0,statusText:""});return e.type="error",e};var u=[301,302,303,307,308];_.redirect=function(e,t){if(-1===u.indexOf(t))throw new RangeError("Invalid status code");return new _(null,{status:t,headers:{location:e}})},e.Headers=f,e.Request=x,e.Response=_,e.fetch=function(e,t){return new Promise((function(r,i){var o=new x(e,t),s=new XMLHttpRequest;s.onload=function(){var e,t,n={status:s.status,statusText:s.statusText,headers:(e=s.getAllResponseHeaders()||"",t=new f,e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(e){var r=e.split(":"),n=r.shift().trim();if(n){var i=r.join(":").trim();t.append(n,i)}})),t)};n.url="responseURL"in s?s.responseURL:n.headers.get("X-Request-URL");var i="response"in s?s.response:s.responseText;r(new _(i,n))},s.onerror=function(){i(new TypeError("Network request failed"))},s.ontimeout=function(){i(new TypeError("Network request failed"))},s.open(o.method,o.url,!0),"include"===o.credentials?s.withCredentials=!0:"omit"===o.credentials&&(s.withCredentials=!1),"responseType"in s&&n&&(s.responseType="blob"),o.headers.forEach((function(e,t){s.setRequestHeader(t,e)})),s.send(void 0===o._bodyInit?null:o._bodyInit)}))},e.fetch.polyfill=!0}function l(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function d(e){return"string"!=typeof e&&(e=String(e)),e}function p(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return r&&(t[Symbol.iterator]=function(){return t}),t}function f(e){this.map={},e instanceof f?e.forEach((function(e,t){this.append(t,e)}),this):Array.isArray(e)?e.forEach((function(e){this.append(e[0],e[1])}),this):e&&Object.getOwnPropertyNames(e).forEach((function(t){this.append(t,e[t])}),this)}function y(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function m(e){return new Promise((function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}}))}function g(e){var t=new FileReader,r=m(t);return t.readAsArrayBuffer(e),r}function b(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function w(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(n&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(i&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(t&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(o&&n&&a(e))this._bodyArrayBuffer=b(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!o||!ArrayBuffer.prototype.isPrototypeOf(e)&&!c(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=b(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},n&&(this.blob=function(){var e=y(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?y(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(g)}),this.text=function(){var e,t,r,n=y(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,r=m(t),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},i&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}function x(e,t){var r,n,i=(t=t||{}).body;if(e instanceof x){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new f(e.headers)),this.method=e.method,this.mode=e.mode,i||null==e._bodyInit||(i=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new f(t.headers)),this.method=(r=t.method||this.method||"GET",n=r.toUpperCase(),h.indexOf(n)>-1?n:r),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&i)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(i)}function v(e){var t=new FormData;return e.trim().split("&").forEach((function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),i=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(i))}})),t}function _(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new f(t.headers),this.url=t.url||"",this._initBody(e)}}(void 0!==e?e:this)}).call(n,void 0);var i=n.fetch;i.Response=n.Response,i.Request=n.Request,i.Headers=n.Headers;e.exports&&(e.exports=i,e.exports.default=i)},function(e,t){e.exports=class extends class{constructor(){}async getRate(e){}}{constructor(){super(),this.forexURL="https://api.nbp.pl/api/exchangerates/rates/a"}async getRate(e){if("pln"===e)return 1;const t=`${this.forexURL}/${e}/`,r=await fetch(t);return+(await r.json()).rates.pop().mid}}},function(e,t){const r="__converted_currency_highlight";class n{constructor(e,t){let n;if(e instanceof HTMLElement?n=e:(n=document.createElement("span"),n.setAttribute("class",r),n.innerText=e),0===n.getElementsByClassName("__converted_currency_popup").length){let e=new i(t);n.appendChild(e.toDOMElement())}this.element=n}activate(){let e=Array.from(this.element.getElementsByClassName("__converted_currency_popup")),t=new i(e.pop());this.element.addEventListener("mouseover",t.toggle.bind(t)),this.element.addEventListener("mouseout",t.toggle.bind(t)),this.element.addEventListener("mousemove",e=>{t.moveTo(e.layerX,e.layerY)})}toDOMElement(){return this.element}toString(){return this.element.outerHTML}}class i{constructor(e){this.boxStyles={display:"none",position:"absolute","z-index":"100000",background:"white",border:"1px solid #ddd","border-radius":"5px","box-shadow":"3px 3px #ddd",padding:"10px"},e instanceof HTMLElement?this.element=e:(e=`${e}`,this.element=document.createElement("div"),this.element.setAttribute("class","__converted_currency_popup"),this.element.setAttribute("style",this.getStyle(this.boxStyles)),this.element.innerText=e.replace(".",",")+" PLN")}getStyle(e){let t="";for(let r in e)r in e&&(t+=`${r}:${e[r]};`);return t}updateStyles(e){this.element.setAttribute("style",this.getStyle(e))}toggle(){let e=this.boxStyles;e.display="block"===e.display?"none":"block",this.updateStyles(e)}moveTo(e,t){let r=this.boxStyles;r.top=`${t}px`,r.left=`${e}px`,this.updateStyles(r)}toDOMElement(){return this.element}}e.exports=class{constructor(e){e instanceof HTMLElement?(this.node=e,this.compiled=this.node.innerHTML):this.compiled=`${e}`}async highlight(e){const t=/([€£$])((?:\d+[ .,]?)+(?:[.,](?:\d{2}))?)\b/g;let n,i,o,s,a=new Map;for(;n=t.exec(this.node.innerHTML);){[i,o,s]=n;let t=await e.call({},s,o);a.set(i,t)}for(let[e,t]of a){let n,i=document.evaluate('//text()[contains(., "'+e+'")]',this.node,null,XPathResult.UNORDERED_NODE_ITERATOR_TYPE,null),o=[];for(;n=i.iterateNext();){let e=n.parentElement;e.getAttribute("class")!==r&&o.push(e)}o.forEach(r=>{r.innerHTML=r.innerHTML.replace(e,this.create(e,t))})}}save(){this.activateHighlightedElements(this.node)}toString(){return this.compiled}create(e,t){return new n(e,t)}activateHighlightedElements(e){let t=e.getElementsByClassName(r);for(let e of t)new n(e).activate()}}},function(e,t,r){let n=r(0);!async function(){const e=await new n(["usd","gbp","eur","pln"]),t=await e.serialize();chrome.tabs.onUpdated.addListener((e,r,n)=>{chrome.tabs.sendMessage(e,{action:"doCurrencyConversion",application:t})})}()}]);