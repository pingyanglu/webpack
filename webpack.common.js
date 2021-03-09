const webpack = require('webpack');
const extractTextCss = require('extract-text-webpack-plugin');
const  dev= require('./webpack.dev.js');
const  pro= require('./webpack.pro.js');
const  merge = require('webpack-merge');
module.exports = env => {
	var postPlugin = [require('autoprefixer')(),require('postcss-cssnext')()];
	postPlugin.concat(env==='production'?[require('postcss-sprites')({
		spritePath:'dist/sprite',
		retina:true
	})]:[])
	var common = {
		entry: './app.js',
		output: {
			filename: 'bundle.js'
		},
		module: {
			rules: [
				//js处理
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader'
					}
				},
				//css处理
				//编译提取成一个css 改写如下
				{
					// test:/\.css$/,
					test: /\.less$/,
					use: extractTextCss.extract({
						fallback: {
							loader: 'style-loader',
							options: {
								insertAt: { before: "#main" }
							}
						},
						use: [
							{
								loader: 'css-loader',
								options: {
									modules: {
										//便于阅读编译后的css类名
										localIdentName: '[path][name]_[local]_[hash:4]'
									}
								}
							},
							/* postcss-loader需要写在其它的预处理语言之前 */
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss',//接下来定义的plugin是给谁用的
									plugins:postPlugin,
									plugins: [
										//引用并调用
										/* require('autoprefixer')(
											// {
												// * 指定编译目标 *
												// * 像babel css3这些编译都需要指定目标,但是每一个都指定目标太麻烦,可能造成不统一,在
												// * 方法一:package.json中统一配置(推荐使用这种)
												// * 对于babel  autoprefixer这些需要指定overrideBrowserslist的都是有效的
												// * 方法二:新建.browserslistrc文件
												// *
											// webpack4写法:overrideBrowserslist 
											// webpack3写法:Browserslist 
											// "overrideBrowserslist":[
											// 	">1%","last 2 versions"
											// ]
											// }
										),
										require('postcss-cssnext')()//处理下一代css写法 */
									]
								}
							},
							{
								loader: "less-loader"
							}
						]
					})
				}]
		},
		plugins:[
			new extractTextCss({
				/* 明明类似于entry的命名 */
				filename:env==='production'?'app.bundle.css':'app.dev.css'
			})
		]
	}
	return merge.merge(common,env=='production'?pro:dev)
}