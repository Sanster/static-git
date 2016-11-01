var path = require('path')
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: path.resolve(__dirname, '../app/src/main.js'),
  output: {
    path: path.resolve(__dirname, '../app/dist'),
    filename: '[name].js'
  },
  target: 'electron',
  externals: [
    nodeExternals({
      'modulesDir': path.resolve(__dirname, '../node_modules')
    })
  ],
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "_": "lodash"
    })
  ],
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
        loader: 'style!css'
      },
      {
        test: /\.sass$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url'
      }
    ]
  }
}
