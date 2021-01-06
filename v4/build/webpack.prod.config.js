const { resolve } = require('path')
const WebpackTransformPlugins = require('../plugins/webpack-transform-plugins')
module.exports = {
  mode: 'development',
  entry: {
    index: resolve(__dirname, '../src/index.js')
  },
  output: {
    filename: 'bundle.[name].js',
    path: resolve(__dirname, '../dist')
  },
  plugins: [
    new WebpackTransformPlugins()
  ]
}
