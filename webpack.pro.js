const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	optimization: {
		minimize: false
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",//必填项
			template: "./index.html",//无法凭空产生一个html,以本地的html为模板
			minify: {
				collapseWhitespace: false//是否压缩
			},
			inject: true,//是否自动引入html
		})
	]
}