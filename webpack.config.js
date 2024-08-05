const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin'); // Minifikacja JS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Minifikacja CSS
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin'); // Minifikacja HTML


module.exports = {
  entry: './src/script.ts',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: true, 
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/assets', to: 'assets' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // injects CSS to the DOM by injecting a <style> tag
          'css-loader', // translates CSS into CommonJS modules
          'sass-loader', // compiles Sass to CSS
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add '.js' if your project contains any regular JavaScript files
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(), // Minifikacja JS
      new CssMinimizerPlugin(), // Minifikacja CSS
      new HtmlMinimizerPlugin(), // Minifikacja HTML
    ],
  },
};
