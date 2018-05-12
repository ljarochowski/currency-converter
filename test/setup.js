before(function() {
    global.Application = require('../lib/application.js');
    global.NullLogger = require('../lib/null-logger.js');
    global.Logger = require('../lib/logger.js');
    global.Forex = require('../lib/forex.js');
    global.assert = require('assert');
    global.jsdom = require('jsdom');
    global.window = new jsdom.JSDOM().window;
    global.document = window.document;
    global.HTMLElement = window.HTMLElement;
});
