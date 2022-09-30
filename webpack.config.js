const path = require('path');

module.exports = {
  devtool: "inline-source-map",
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8085,
    hot: true
  },
};