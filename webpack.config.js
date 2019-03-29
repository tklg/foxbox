const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const path = require('path')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const PUBLIC_PATH = '/'

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'

  return {
    mode: mode || 'development',
    entry: {
      index: './src/index.js'
    },
    output: {
      path: path.join(__dirname, '/server/public'),
      filename: '[name].bundle.js',
      publicPath: PUBLIC_PATH
    },
    module: {
      rules: [
        {
          use: 'babel-loader',
          test: /\.jsx?$/,
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    optimization: {
      // minimize: false
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '/templates/index.html'),
        filename: path.join(__dirname, '/server/public/index.html'),
        chunks: ['index'],
        hash: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_PATH)
      }),
      new SWPrecacheWebpackPlugin({
        cacheId: 'sendlet',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: PUBLIC_PATH + 'index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
      })
    ],
    devServer: {
      historyApiFallback: true,
      disableHostCheck: true,
      port: 3000
    }
  }
}
