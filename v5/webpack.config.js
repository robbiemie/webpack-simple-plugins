const path = require('path');
const SimpleWebpackPlugin = require('./SimpleWebpackPlugin')

module.exports = {
  entry: './test.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simple.bundle.js'
  },
  plugins: [
    new SimpleWebpackPlugin({
      console: true
    })
  ]
};