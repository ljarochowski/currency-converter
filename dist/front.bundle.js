(()=>{var e={160:(e,t,r)=>{const n=r(720),s=r(872),{Forex:i,CachedForex:o}=r(664),a=r(264),c=r(496);class h{constructor(e,t,r={}){this.options=r||{},this.currencies=e||[],this.rates=t,this.logger={},this.forexService={},this.highlighterService={}}async getLogger(){return this.logger instanceof n||this.logger instanceof s||(!0===this.options.debug?this.logger=new n:this.logger=new s),this.logger}async getForexService(){if(this.forexService instanceof i)return this.forexService;try{this.forexService=new o(new a,this.currencies),await this._loadExchangeRates()}catch(e){throw e}return this.forexService}async _loadExchangeRates(){return this.forexService.loadExchangeRates(this.rates)}async getHighlighterService(e){return this.highlighterService instanceof c||(this.highlighterService=new c(e)),this.highlighterService}async serialize(){return Object.freeze({rates:(await this.getForexService()).getRates(),options:this.options,currencies:this.currencies})}static unserialize(e){return new h(e.currencies,e.rates,e.options)}}e.exports=h},264:e=>{class t{constructor(){}async getRate(e){}}e.exports=class extends t{constructor(){super(),this.forexURL="https://api.nbp.pl/api/exchangerates/rates/a"}async getRate(e){if("pln"===e)return 1;const t=`${this.forexURL}/${e}/`,r=await fetch(t);return+(await r.json()).rates.pop().mid}}},664:(e,t,r)=>{r(332);class n{constructor(e,...t){if(t[0]instanceof Array?[...t]=t[0]:[...t]=t,0===t.length)throw Error("no currencies set");this.currencyRepository=new s(Array.from(t)),this.currencies=this.currencyRepository.getCurrencies(),this.forexRepository=e,this.exchange={}}async loadExchangeRates(e){for(let t in this.currencies)if(t in this.currencies){const r=this.currencies[t];e instanceof Object&&null!==e[r]?this.addRate(r,e[r]):this.addRate(r,await this.getRate(r))}return this}async convert(e,t,r){t=this.currencyRepository.getISOcode(t),r=this.currencyRepository.getISOcode(r);let n=await this.getConversionRate(t,r);return Math.round(100*e*n,2)/100}async getConversionRate(e,t){e=this.currencyRepository.getISOcode(e),t=this.currencyRepository.getISOcode(t);let r=await this.getRate(e);if(null===r)throw Error(`currency ${e} unknown`);let n=await this.getRate(t);if(null===n)throw Error(`currency ${t} unknown`);return r/n}addRate(e,t){return this.exchange[e]=t,this}async getRate(e){try{this.addRate(e,await this.forexRepository.getRate(e))}catch(t){this.addRate(e,null)}return this.exchange[e]}getRates(){return this.exchange}}class s{constructor(e){this.currencyISOnames={"€":"eur","£":"gbp",$:"usd",zł:"pln"},this.currencies=e.map(this.getISOcode.bind(this))}getISOcode(e){return e=`${e}`.toLowerCase(),void 0!==this.currencyISOnames[e]?this.currencyISOnames[e]:e}getCurrencies(){return this.currencies}}e.exports={Forex:n,CachedForex:class extends n{constructor(...e){super(...e),this.cacheTimeStamp=0,this.currencyCacheTimeStamp={},this.ttl=14400}addRate(e,t){return this.currencyCacheTimeStamp[e]=Date.now(),this.cacheTimeStamp=Date.now(),super.addRate(e,t)}async loadExchangeRates(e){return this.cacheTimeStamp=Date.now(),super.loadExchangeRates(e)}async getRate(e){return this.hasFXexpired(e)||void 0===this.exchange[e]?super.getRate(e):this.exchange[e]}hasFXexpired(e){let t;return t=void 0!==e?Math.min(this.currencyCacheTimeStamp[e],this.cacheTimeStamp):this.cacheTimeStamp,Date.now()-t>this.ttl}}}},496:e=>{const t="__converted_currency_highlight",r="__converted_currency_popup";class n{constructor(e,n){let i;if(e instanceof HTMLElement?i=e:(i=document.createElement("span"),i.setAttribute("class",t),i.innerText=e),0===i.getElementsByClassName(r).length){let e=new s(n);i.appendChild(e.toDOMElement())}this.element=i}activate(){let e=Array.from(this.element.getElementsByClassName(r)),t=new s(e.pop());this.element.addEventListener("mouseover",t.toggle.bind(t)),this.element.addEventListener("mouseout",t.toggle.bind(t)),this.element.addEventListener("mousemove",(e=>{t.moveTo(e.layerX,e.layerY)}))}toDOMElement(){return this.element}toString(){return this.element.outerHTML}}class s{constructor(e){this.boxStyles={display:"none",position:"absolute","z-index":"100000",background:"white",border:"1px solid #ddd","border-radius":"5px","box-shadow":"3px 3px #ddd",padding:"10px"},e instanceof HTMLElement?this.element=e:(e=`${e}`,this.element=document.createElement("div"),this.element.setAttribute("class",r),this.element.setAttribute("style",this.getStyle(this.boxStyles)),this.element.innerText=e.replace(".",",")+" PLN")}getStyle(e){let t="";for(let r in e)r in e&&(t+=`${r}:${e[r]};`);return t}updateStyles(e){this.element.setAttribute("style",this.getStyle(e))}toggle(){let e=this.boxStyles;e.display="block"===e.display?"none":"block",this.updateStyles(e)}moveTo(e,t){let r=this.boxStyles;r.top=`${t}px`,r.left=`${e}px`,this.updateStyles(r)}toDOMElement(){return this.element}}e.exports=class{constructor(e){e instanceof HTMLElement?(this.node=e,this.compiled=this.node.innerHTML):this.compiled=`${e}`}async highlight(e){const r=/([€£$])((?:\d+[ .,]?)+(?:[.,](?:\d{2}))?)\b/g;let n,s,i,o,a=new Map;for(;n=r.exec(this.node.innerHTML);){[s,i,o]=n;let t=await e.call({},o,i);a.set(s,t)}for(let[e,r]of a){let n,s=document.evaluate('//text()[contains(., "'+e+'")]',this.node,null,XPathResult.UNORDERED_NODE_ITERATOR_TYPE,null),i=[];for(;n=s.iterateNext();){let e=n.parentElement;e.getAttribute("class")!==t&&i.push(e)}i.forEach((t=>{t.innerHTML=t.innerHTML.replace(e,this.create(e,r))}))}}save(){this.activateHighlightedElements(this.node)}toString(){return this.compiled}create(e,t){return new n(e,t)}activateHighlightedElements(e){let r=e.getElementsByClassName(t);for(let e of r)new n(e).activate()}}},720:e=>{e.exports=class{log(...e){console.log(...e)}}},872:e=>{e.exports=class{log(...e){}}},332:(e,t,r)=>{var n="undefined"!=typeof globalThis&&globalThis||"undefined"!=typeof self&&self||void 0!==r.g&&r.g,s=function(){function e(){this.fetch=!1,this.DOMException=n.DOMException}return e.prototype=n,new e}();!function(e){!function(t){var r=void 0!==e&&e||"undefined"!=typeof self&&self||void 0!==r&&r,n="URLSearchParams"in r,s="Symbol"in r&&"iterator"in Symbol,i="FileReader"in r&&"Blob"in r&&function(){try{return new Blob,!0}catch(e){return!1}}(),o="FormData"in r,a="ArrayBuffer"in r;if(a)var c=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],h=ArrayBuffer.isView||function(e){return e&&c.indexOf(Object.prototype.toString.call(e))>-1};function u(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e)||""===e)throw new TypeError('Invalid character in header field name: "'+e+'"');return e.toLowerCase()}function l(e){return"string"!=typeof e&&(e=String(e)),e}function d(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return s&&(t[Symbol.iterator]=function(){return t}),t}function f(e){this.map={},e instanceof f?e.forEach((function(e,t){this.append(t,e)}),this):Array.isArray(e)?e.forEach((function(e){this.append(e[0],e[1])}),this):e&&Object.getOwnPropertyNames(e).forEach((function(t){this.append(t,e[t])}),this)}function p(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function y(e){return new Promise((function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}}))}function g(e){var t=new FileReader,r=y(t);return t.readAsArrayBuffer(e),r}function b(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function m(){return this.bodyUsed=!1,this._initBody=function(e){var t;this.bodyUsed=this.bodyUsed,this._bodyInit=e,e?"string"==typeof e?this._bodyText=e:i&&Blob.prototype.isPrototypeOf(e)?this._bodyBlob=e:o&&FormData.prototype.isPrototypeOf(e)?this._bodyFormData=e:n&&URLSearchParams.prototype.isPrototypeOf(e)?this._bodyText=e.toString():a&&i&&(t=e)&&DataView.prototype.isPrototypeOf(t)?(this._bodyArrayBuffer=b(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):a&&(ArrayBuffer.prototype.isPrototypeOf(e)||h(e))?this._bodyArrayBuffer=b(e):this._bodyText=e=Object.prototype.toString.call(e):this._bodyText="",this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):n&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},i&&(this.blob=function(){var e=p(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?p(this)||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer)):this.blob().then(g)}),this.text=function(){var e,t,r,n=p(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,r=y(t=new FileReader),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},o&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}f.prototype.append=function(e,t){e=u(e),t=l(t);var r=this.map[e];this.map[e]=r?r+", "+t:t},f.prototype.delete=function(e){delete this.map[u(e)]},f.prototype.get=function(e){return e=u(e),this.has(e)?this.map[e]:null},f.prototype.has=function(e){return this.map.hasOwnProperty(u(e))},f.prototype.set=function(e,t){this.map[u(e)]=l(t)},f.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},f.prototype.keys=function(){var e=[];return this.forEach((function(t,r){e.push(r)})),d(e)},f.prototype.values=function(){var e=[];return this.forEach((function(t){e.push(t)})),d(e)},f.prototype.entries=function(){var e=[];return this.forEach((function(t,r){e.push([r,t])})),d(e)},s&&(f.prototype[Symbol.iterator]=f.prototype.entries);var w=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function x(e,t){if(!(this instanceof x))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var r,n,s=(t=t||{}).body;if(e instanceof x){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new f(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,s||null==e._bodyInit||(s=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"same-origin",!t.headers&&this.headers||(this.headers=new f(t.headers)),this.method=(n=(r=t.method||this.method||"GET").toUpperCase(),w.indexOf(n)>-1?n:r),this.mode=t.mode||this.mode||null,this.signal=t.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&s)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(s),!("GET"!==this.method&&"HEAD"!==this.method||"no-store"!==t.cache&&"no-cache"!==t.cache)){var i=/([?&])_=[^&]*/;i.test(this.url)?this.url=this.url.replace(i,"$1_="+(new Date).getTime()):this.url+=(/\?/.test(this.url)?"&":"?")+"_="+(new Date).getTime()}}function v(e){var t=new FormData;return e.trim().split("&").forEach((function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),s=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(s))}})),t}function E(e,t){if(!(this instanceof E))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText=void 0===t.statusText?"":""+t.statusText,this.headers=new f(t.headers),this.url=t.url||"",this._initBody(e)}x.prototype.clone=function(){return new x(this,{body:this._bodyInit})},m.call(x.prototype),m.call(E.prototype),E.prototype.clone=function(){return new E(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},E.error=function(){var e=new E(null,{status:0,statusText:""});return e.type="error",e};var T=[301,302,303,307,308];E.redirect=function(e,t){if(-1===T.indexOf(t))throw new RangeError("Invalid status code");return new E(null,{status:t,headers:{location:e}})},t.DOMException=r.DOMException;try{new t.DOMException}catch(e){t.DOMException=function(e,t){this.message=e,this.name=t;var r=Error(e);this.stack=r.stack},t.DOMException.prototype=Object.create(Error.prototype),t.DOMException.prototype.constructor=t.DOMException}function R(e,n){return new Promise((function(s,o){var c=new x(e,n);if(c.signal&&c.signal.aborted)return o(new t.DOMException("Aborted","AbortError"));var h=new XMLHttpRequest;function u(){h.abort()}h.onload=function(){var e,t,r={status:h.status,statusText:h.statusText,headers:(e=h.getAllResponseHeaders()||"",t=new f,e.replace(/\r?\n[\t ]+/g," ").split("\r").map((function(e){return 0===e.indexOf("\n")?e.substr(1,e.length):e})).forEach((function(e){var r=e.split(":"),n=r.shift().trim();if(n){var s=r.join(":").trim();t.append(n,s)}})),t)};r.url="responseURL"in h?h.responseURL:r.headers.get("X-Request-URL");var n="response"in h?h.response:h.responseText;setTimeout((function(){s(new E(n,r))}),0)},h.onerror=function(){setTimeout((function(){o(new TypeError("Network request failed"))}),0)},h.ontimeout=function(){setTimeout((function(){o(new TypeError("Network request failed"))}),0)},h.onabort=function(){setTimeout((function(){o(new t.DOMException("Aborted","AbortError"))}),0)},h.open(c.method,function(e){try{return""===e&&r.location.href?r.location.href:e}catch(t){return e}}(c.url),!0),"include"===c.credentials?h.withCredentials=!0:"omit"===c.credentials&&(h.withCredentials=!1),"responseType"in h&&(i?h.responseType="blob":a&&c.headers.get("Content-Type")&&-1!==c.headers.get("Content-Type").indexOf("application/octet-stream")&&(h.responseType="arraybuffer")),!n||"object"!=typeof n.headers||n.headers instanceof f?c.headers.forEach((function(e,t){h.setRequestHeader(t,e)})):Object.getOwnPropertyNames(n.headers).forEach((function(e){h.setRequestHeader(e,l(n.headers[e]))})),c.signal&&(c.signal.addEventListener("abort",u),h.onreadystatechange=function(){4===h.readyState&&c.signal.removeEventListener("abort",u)}),h.send(void 0===c._bodyInit?null:c._bodyInit)}))}R.polyfill=!0,r.fetch||(r.fetch=R,r.Headers=f,r.Request=x,r.Response=E),t.Headers=f,t.Request=x,t.Response=E,t.fetch=R}({})}(s),s.fetch.ponyfill=!0,delete s.fetch.polyfill;var i=n.fetch?n:s;(t=i.fetch).default=i.fetch,t.fetch=i.fetch,t.Headers=i.Headers,t.Request=i.Request,t.Response=i.Response,e.exports=t}},t={};function r(n){var s=t[n];if(void 0!==s)return s.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{let e=r(160);!async function(){chrome.runtime.onMessage.addListener(((t,r,n)=>{"doCurrencyConversion"===t.action&&async function(e){const t=await e.getForexService(),r=await e.getHighlighterService(document.body);await r.highlight((async(e,r)=>(e=/^[,.]$/.test(`${e}`.substr(-3,1))?+(`${e}`.slice(0,-3).replace(/[ ,.]/g,"")+"."+`${e}`.slice(-2)):+`${e}`.replace(/[ ,.]/g,""),t.convert(e,r,"pln")))),r.save()}(e.unserialize(t.application))}))}()})()})();