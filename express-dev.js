const express = require('express');
const webpackDevMid = require('webpack-dev-middleware');
const webpackHotMid = require('webpack-hot-middleware');
const webpack = require('webpack');
const app =express()
const config = require('./webpack.config.js');
// console.log('config>>>>>>>>>>',config)
Object.keys(config).forEach(name=>{
	config.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(config.entry[name])
})
const compiler = webpack(config);
// console.log(compiler)
app.use(webpackDevMid(compiler,{}));
app.use(webpackHotMid(compiler,{
	overlayStyles:true
}));

app.listen(2021)