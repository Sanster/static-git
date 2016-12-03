var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, '../app/src/main.js')],
  output: {
    path: path.resolve(__dirname, '../app/dist'),
    publicPath: path.resolve(__dirname, '../app/dist') + '/',
    filename: '[name].js'

  },
  target: 'electron',
  externals: [
    function(context, request, callback) {
      if(/^nodegit/.test(request))
        return callback(null, 'commonjs' + " " + request);
      callback();
    },
  ],
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "_": "lodash"
    })
  ],
  resolve: {
    alias: {
      style: path.join(__dirname, '../app/src/stylesheet'),
      components: path.join(__dirname, '../app/src/components'),
      layout: path.join(__dirname, '../app/src/layout'),
      modules: path.join(__dirname, '../app/src/modules')
    }
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
        loader: 'style!css'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  }
}
