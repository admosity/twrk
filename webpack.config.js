var path = require("path");
var webpack = require("webpack");
var AngularPlugin = require('angular-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
module.exports = {
  cache: true,
  watch: true,
  entry: {
    // jquery: "./app/jquery",
    // bootstrap: ["!bootstrap-webpack!./app/bootstrap/bootstrap.config.js", "./app/bootstrap"],
    // react: "./app/react"
    app: "./src/js/app.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "dist/",
    filename: "[name].js",
    chunkFilename: "[chunkhash].js"
  },
  module: {
    loaders: [
      // required to write "require('./style.css')"
      { test: /\.css$/,    loader: "style-loader!css-loader" },
      {
        test: /\.scss$/,
        // Query parameters are passed to node-sass
        loader: "style!css!sass?outputStyle=expanded&" +
          "includePaths[]=" +
            (path.resolve(__dirname, "./bower_components")) + "&" +
          "includePaths[]=" +
            (path.resolve(__dirname, "./node_modules"))
      },

      { test: /\.ls$/, loader: "livescript!"},

      // required for bootstrap icons
      { test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader?prefix=font/" },
      { test: /\.eot$/,    loader: "file-loader?prefix=font/" },
      { test: /\.svg$/,    loader: "file-loader?prefix=font/" },

      // required for react jsx
      // { test: /\.js$/,    loader: "jsx-loader" },
      // { test: /\.jsx$/,   loader: "jsx-loader?insertPragma=React.DOM" },
    ]
  },
  resolve: {
    modulesDirectories: ["bower_components", "node_modules"],
    alias: {
      // // Bind version of jquery
      // jquery: "jquery-2.0.3",

      // // Bind version of jquery-ui
      // "jquery-ui": "jquery-ui-1.10.3",

      // // jquery-ui doesn't contain a index file
      // // bind module to the complete module
      // "jquery-ui-1.10.3$": "jquery-ui-1.10.3/ui/jquery-ui.js",

      "jquery": path.join(__dirname, "node_modules/jquery/dist/jquery.js"),

      // "angular-ui-bootstrap$": "angular-ui-bootstrap"
      "angular-ui-bootstrap": path.join(__dirname, "node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js")

    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      // Automtically detect jQuery and $ as free var in modules
      // and inject the jquery library
      // This is required by many jquery plugins
      jQuery: "jquery",
      $: "jquery",
    }),
    // new AngularPlugin(),
    new ngAnnotatePlugin({
      add: true,
    })
  ]
};