 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: {
    test: "./test/test.js",
    fxengine: "./src/Fxengine.js"
  },
  mode: "development",
  devtool: 'inline-source-map',
});