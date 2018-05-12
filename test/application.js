describe('Application test suite', function() {
    describe('#getLogger', function() {
        it('should return NullLogger if debug is not set', async function() {
            const app = new Application();
            const logger = await app.getLogger();
            assert(logger instanceof NullLogger);
        });
        it('should return Logger if debug is set', async function() {
            const app = new Application(['eur'], null, {debug: true});
            const logger = await app.getLogger();
            assert(logger instanceof Logger);
        });
        it(`NullLogger once set shouldn't be changed
            in any circumstances`, async function() {
                const app = new Application();
                const logger = await app.getLogger();
                app.options.debug = true;
                const logger2 = await app.getLogger();
                assert(logger2 instanceof NullLogger
                    && logger instanceof NullLogger);
        });
        it('should return singleton instance of NullLogger', async function() {
            const app = new Application();
            const logger = await app.getLogger();
            const mark = Math.random();
            logger.__mark = mark;
            const logger2 = await app.getLogger();
            assert.equal(logger2.__mark, mark);
        });
        it(`Logger once set shouldn't be changed
            in any circumstances`, async function() {
                const app = new Application(['eur'], null, {debug: true});
                const logger = await app.getLogger();
                app.options.debug = true;
                const logger2 = await app.getLogger();
                assert(logger2 instanceof Logger
                    && logger instanceof Logger);
        });
        it('should return singleton instance of Logger', async function() {
            const app = new Application(['eur'], null, {debug: true});
            const logger = await app.getLogger();
            const mark = Math.random();
            logger.__mark = mark;
            const logger2 = await app.getLogger();
            assert.equal(logger2.__mark, mark);
        });
    });
    describe('#getForexService', function() {
        it('should return singleton instance of Forex', async function() {
            const app = new Application(['eur']);
            const forex = await app.getForexService();
            const mark = Math.random();
            forex.__mark = mark;
            const forex2 = await app.getForexService();
            assert.equal(forex2.__mark, mark);
        });
    });
    describe('#getHighlighterService', function() {
        it('should return singleton instance of Highlighter', async function() {
            const app = new Application(['eur']);
            const highlighter = await app.getHighlighterService();
            const mark = Math.random();
            highlighter.__mark = mark;
            const highlighter2 = await app.getHighlighterService();
            assert.equal(highlighter2.__mark, mark);
        });
    });
    describe('#serialize', function() {
        it('should contain currencies set', async function() {
            const app = new Application(['eur']);
            assert.deepEqual((await app.serialize()).currencies, ['eur']);
        });
        it('should contain any rates previously set', async function() {
            const rate = 10 * Math.random();
            const app = new Application(['eur'], {eur: rate});
            assert.deepEqual((await app.serialize()).rates, {eur: rate});
        });
        it('should contain any options previously set', async function() {
            const options = {debug: true};
            const app = new Application(['eur'], null, options);
            assert.deepEqual((await app.serialize()).options, options);
        });
        it('should throw an error when no currencies given', async function() {
            const app = new Application(null, null, null);
            try {
                await app.serialize();
                assert.fail('failed to throw an Error');
            } catch (err) {
            }
        });
        it('should serialize rates to empty object if unknown currencies given',
            async function() {
                const app = new Application(['xyz'], null, null);
                const serialized = await app.serialize();
                assert.deepEqual(serialized.rates, {});
        });
        it('should serialize options to empty object if none given',
            async function() {
                const app = new Application(['xyz'], null, null);
                const serialized = await app.serialize();
                assert.deepEqual(serialized.options, {});
        });
    });
    describe('#unserialize', function() {
        it('should contain currencies set', async function() {
            const app = new Application(['xyz']);
            const serialized = await app.serialize();
            const app2 = Application.unserialize(serialized);
            assert.deepEqual(app.currencies, app2.currencies);
        });
        it('should contain any rates previously set', async function() {
            const rate = 10 * Math.random();
            const app = new Application(['xyz'], {xyz: rate});
            const serialized = await app.serialize();
            const app2 = Application.unserialize(serialized);
            assert.deepEqual(app.rates, app2.rates);
            assert.deepEqual(app.rates, {xyz: rate});
            assert.deepEqual(app2.rates, {xyz: rate});
        });
        it('should contain any options previously set', async function() {
            const options = {__rand: Math.random()};
            const app = new Application(['xyz'], null, options);
            const serialized = await app.serialize();
            const app2 = Application.unserialize(serialized);
            assert.deepEqual(app.options, app2.options);
            assert.deepEqual(app.options, options);
            assert.deepEqual(app2.options, options);
        });
    });
});
