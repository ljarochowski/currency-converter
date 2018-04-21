class NullLogger {
    constructor() {
        return (...what) => {}
    }
}

module.exports = new NullLogger();
