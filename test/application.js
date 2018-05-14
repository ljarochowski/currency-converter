const Application = require('../lib/application.js');
const NullLogger = require('../lib/null-logger.js');
const Logger = require('../lib/logger.js');

describe('Application test suite', () => {
    let app;
    beforeEach(async () => {
        app = new Application(['eur']);
    });
    describe('#getLogger', () => {
        let logger;
        describe('#Logger', () => {
            beforeEach(async () => {
                logger = await app.getLogger();
            });
            it('should return NullLogger if debug is not set', async () => {
                assert(logger instanceof NullLogger);
            });
            it(`NullLogger once set shouldn't be changed
                in any circumstances`, async () => {
                    app.options.debug = true;
                    const logger2 = await app.getLogger();
                    assert(logger2 instanceof NullLogger);
                    assert(logger instanceof NullLogger);
            });
            it('should return singleton instance of NullLogger', async () => {
                const mark = Math.random();
                logger.__mark = mark;
                const logger2 = await app.getLogger();
                assert.equal(logger2.__mark, mark);
            });
        });
        describe('#NullLogger', () => {
            beforeEach(async () => {
                app = new Application(['eur'], null, {debug: true});
                logger = await app.getLogger();
            });
            it('should return Logger if debug is set', async () => {
                assert(logger instanceof Logger);
            });
            it(`Logger once set shouldn't be changed
                in any circumstances`, async () => {
                    app.options.debug = true;
                    const logger2 = await app.getLogger();
                    assert(logger2 instanceof Logger);
                    assert(logger instanceof Logger);
            });
            it('should return singleton instance of Logger', async () => {
                const mark = Math.random();
                logger.__mark = mark;
                const logger2 = await app.getLogger();
                assert.equal(logger2.__mark, mark);
            });
        });
    });
    describe('#getForexService', () => {
        it('should return singleton instance of Forex', async () => {
            const forex = await app.getForexService();
            const mark = Math.random();
            forex.__mark = mark;
            const forex2 = await app.getForexService();
            assert.equal(forex2.__mark, mark);
        });
    });
    describe('#getHighlighterService', () => {
        it('should return singleton instance of Highlighter', async () => {
            const highlighter = await app.getHighlighterService();
            const mark = Math.random();
            highlighter.__mark = mark;
            const highlighter2 = await app.getHighlighterService();
            assert.equal(highlighter2.__mark, mark);
        });
    });
    describe('#serialize', () => {
        let rate;
        let options;
        let serialized;
        describe('#known currencies', () => {
            beforeEach(async () => {
                rate = 10 * Math.random();
                options = {debug: true};
                app = new Application(['eur'], {eur: rate}, options);
                serialized = await app.serialize();
            });
            it('should contain currencies set', async () => {
                assert.deepEqual((await app.serialize()).currencies, ['eur']);
            });
            it('should contain any rates previously set', async () => {
                assert.deepEqual((await app.serialize()).rates, {eur: rate});
            });
            it('should contain any options previously set', async () => {
                assert.deepEqual((await app.serialize()).options, options);
            });
        });
        describe('#unknown currencies', () => {
            beforeEach(async () => {
                app = new Application(['xyz'], null, null);
                serialized = await app.serialize();
            });
            it(`should serialize rates to an object
                containing null values for each unknown currency`,
                async () => {
                    assert.deepEqual(serialized.rates, {xyz: null});
            });
            it('should serialize options to empty object if none given',
                async () => {
                    assert.deepEqual(serialized.options, {});
            });
        });
        it('should throw an error when no currencies given', async () => {
            const app = new Application(null, null, null);
            try {
                await app.serialize();
                assert.fail('failed to throw an Error');
            } catch (err) {
            }
        });
    });
    describe('#unserialize', () => {
        let rate;
        let options;
        let app2;
        let serialized;
        beforeEach(async () => {
            rate = 10 * Math.random();
            options = {__rand: Math.random()};
            app = new Application(['xyz'], {xyz: rate}, options);
            serialized = await app.serialize();
            app2 = Application.unserialize(serialized);
        });
        it('should contain currencies set', async () => {
            assert.deepEqual(app.currencies, app2.currencies);
        });
        it('should contain any rates previously set', async () => {
            assert.deepEqual(app.rates, app2.rates);
            assert.deepEqual(app.rates, {xyz: rate});
            assert.deepEqual(app2.rates, {xyz: rate});
        });
        it('should contain any options previously set', async () => {
            assert.deepEqual(app.options, app2.options);
            assert.deepEqual(app.options, options);
            assert.deepEqual(app2.options, options);
        });
    });
});
