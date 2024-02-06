const path = require('path');

module.exports = {
  entry: {
    main: './main.js',
    front: './front.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
