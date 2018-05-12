let Application = require('../lib/application.js');
let assert = require('assert');

describe('Application test suite', function() {
    describe('#getLogger', function() {
        let NullLogger = require('../lib/null-logger.js');

        it('should return Logger if debug is not set', function() {
            const app = new Application();

            console.log(app.getLogger());
            // assert(app.getLogger() instanceof Logger);
        });
        it('should return NullLogger if debug is set', function() {
        });
    });
});
