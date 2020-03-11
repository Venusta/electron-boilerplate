const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATH_SOURCE = path.join(__dirname, "./src");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
        include: PATH_SOURCE,
      },
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-proposal-class-properties"],
            presets: [
              ["@babel/preset-env", {
                debug: false,
                useBuiltIns: "usage",
                corejs: 3,
              }],
              "@babel/preset-react",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    mainFields: ["module", "main"],
  },
  target: "electron-renderer",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATH_SOURCE, "./index.html"),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "bundle.css",
      chunkFilename: "[id].css",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false,
  },
};
