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
    function (context, request, callback) {
      if (/^nodegit/.test(request)) {
        return callback(null, 'commonjs' + ' ' + request)
      }
      callback()
    }
  ],
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')]
  },
  plugins: [
    new webpack.ProvidePlugin({
      '_': 'lodash'
    })
  ],
  resolve: {
    alias: {
      style: path.join(__dirname, '../app/src/stylesheet'),
      components: path.join(__dirname, '../app/src/components'),
      layout: path.join(__dirname, '../app/src/layout'),
      modules: path.join(__dirname, '../app/src/modules'),
      store: path.join(__dirname, '../app/src/store')
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ]
  }
}
