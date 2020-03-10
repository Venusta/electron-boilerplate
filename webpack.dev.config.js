/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { spawn } = require("child_process");

const PATH_SOURCE = path.join(__dirname, "./src");
const PATH_DIST = path.join(__dirname, "./dist");

module.exports = {
  module: {
    rules: [
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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        include: PATH_SOURCE,
      },
    ],
  },
  entry: [
    path.join(PATH_SOURCE, "./index.jsx"),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    mainFields: ["module", "main"],
  },
  target: "electron-renderer",
  plugins: [
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      DEBUG: false,
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(PATH_SOURCE, "./index.html"),
    }),
  ],
  devtool: "source-map",
  devServer: {
    contentBase: PATH_DIST,
    stats: {
      colors: true,
      chunks: false,
      children: false,
    },
    before() {
      spawn(
        "electron",
        ["."],
        {
          shell: true, env: process.env, stdio: "inherit",
        },
      )
        .on("close", (code) => process.exit(0))
        .on("error", (spawnError) => console.error(spawnError));
    },
  },
};
