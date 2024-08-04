const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/script.ts',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // injects CSS to the DOM by injecting a <style> tag
          'css-loader',   // translates CSS into CommonJS modules
          'sass-loader'   // compiles Sass to CSS
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add '.js' if your project contains any regular JavaScript files
  },
};
