const express = require('express');

const webpackConfig = require("./webpack.config");
const webpack = require("webpack")(webpackConfig);
const webpackMiddleware = require("webpack-dev-middleware");

const server = express();

const PORT = 12345;

server.use(webpackMiddleware(webpack, {
	publicPath: "/",
	index: "index.html",
	lazy: false
}));

server.use("/", express.static("src"));
server.use("/", express.static("src/static"));

server.listen(PORT, function () {
  	console.log('Server is listening on port:', PORT);
});