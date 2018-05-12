class NullLogger {
    constructor() {
        return (...what) => {};
    }
}

module.exports = NullLogger;
