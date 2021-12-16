const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["./app/root.jsx", "./app/styles/dark.css", "./app/styles/global.css", "./app/styles/demo/remix.css"],
  mode: "development",
  
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: [ 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 1000000
            }
        }
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"], fallback: {
    "fs": false, "path" : false, "path": false, "crypto" : false
} },
  output: {
    path: path.resolve(__dirname, "public/"),
    publicPath: "/public/",
    filename: "bundle.js"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};