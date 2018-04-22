class Logger {
    constructor() {
        return (...what) => {
            console.log(...what);
        };
    }
}

module.exports = new Logger();
