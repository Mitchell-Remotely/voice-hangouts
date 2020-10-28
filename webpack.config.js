const path = require('path')
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackCdnPlugin = require('webpack-cdn-plugin')

const isDev = (process && process.env && process.env.npm_lifecycle_script && (process.env.npm_lifecycle_script.includes("development")||process.env.npm_lifecycle_script.includes("addressables") )) || false;
const isAddressable =  (process && process.env && process.env.npm_lifecycle_script && process.env.npm_lifecycle_script.includes("addressables") ) || false;
module.exports = {
  entry: {
    client: [
      './client/index.jsx',
      isDev && 'webpack-hot-middleware/client'
    ].filter((file) => file)
  },
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    isDev && new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, '.env.' + (isAddressable ? 'addressables' : isDev?'development':'production'))
    }),
    !isDev && new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        ecma: 6,
        compress: true,
        comments: false
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Remotely Voice Rooms',
      template: './client/index.template.html'
    })
  ].filter((file) => file),
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        include: path.resolve(__dirname, 'client')
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules:{
              localIdentName: '[path][name]_[local]__[hash:base64:5]'}
            }
          }
        ],
        include: path.resolve(__dirname, 'client')
      }
    ]
  },
  devtool: isDev && 'source-map'
}
