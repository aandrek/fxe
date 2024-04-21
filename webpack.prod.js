const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = merge(common, {
  mode: "production",
  entry: {
    fxengine: "./src/Fxengine.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
  optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        // `terserOptions` options will be passed to `uglify-js`
        // Link to options - https://github.com/mishoo/UglifyJS#minify-options
        terserOptions: {},
      })],
  },
});
