const path = require("path");

module.exports = function () {
  return {
    entry: "./example/index.ts",
    module: {
      rules: [
        {
          test: [/\.ts?$/, /\.js?$/],
          use: "babel-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
    },
  };
};
