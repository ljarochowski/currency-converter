before(function() {
  global.assert = require('assert');
  global.jsdom = require('jsdom');
  global.sinon = require('sinon');
  global.fetch = require('cross-fetch');
  global.window = new jsdom.JSDOM().window;
  global.document = window.document;
  global.HTMLElement = window.HTMLElement;
});
