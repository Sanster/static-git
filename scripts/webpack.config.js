var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, '../app/src/main.js'),
  output: {
    path: path.resolve(__dirname, '../app/dist'),
    filename: '[name].js'
  },
  target: 'electron',
  resolveLoader: {
    modules: ['node_modules', __dirname + '../node_modules'],
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.svg$/,
        loaders: ['svg-inline']
      }
    ]
  }
}
