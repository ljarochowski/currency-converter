const path = require('path');

module.exports = {
  entry: {
      main: './main.js',
      front: './front.js',
      lib: './lib/application.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
