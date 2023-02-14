const path = require("path");

module.exports = {
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./distdev"),
    clean: true,
    library: "Fxengine",
    libraryTarget: 'umd'
  }
};
