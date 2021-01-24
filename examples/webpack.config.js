/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  entry: ['regenerator-runtime', './examples/src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[contenthash].js.map',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env'], '@babel/preset-typescript'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
          },
        },
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/src/index.html',
    }),
    new CleanWebpackPlugin(),
  ],
  stats: {
    colors: true,
    reasons: true,
    chunks: true,
  },
  devServer: {
    host: '0.0.0.0',
    port: 8011,
    progress: true,
    hot: true,
    historyApiFallback: true,
    compress: true,

    // added because of bug in webpack, remove this once the bug is resolved
    disableHostCheck: true,
  },
};
