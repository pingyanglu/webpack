// var extractTextCss = require('extract-text-webpack-plugin');//打包成一个css文件
var htmlWebpackPlugin = require('html-webpack-plugin');
const webpack=require('webpack');
const webpackSpriteSmith = require('webpack-spritesmith');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//dll优化打包速度
//1.一般我们书写业务代码,对于第三方包不会动
//2.但是webpack每次都会去处理第三方包
//dll原理:先行打包第三方库,然后告诉webpack不用再处理
const wba = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;//社区版本的分析工具  在plugin中new一下
const path = require('path');
//happypack原理:
//用happypack代替loader去工作
//js默认是单线程的
//node可以开多线程
//**注意**
//任何操作都会增加时间
//如果操作的内容很少,使用Happypack反而会增加时间
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({size:os.cpus().length});

module.exports = {
		// mode:"production",//开发环境  'production'生产环境 'development'开发环境  webpack4中生产环境下 自动开启压缩和tree-shaking
		entry:'./app.js', //单入口
		// entry:['./app.js','./app1.js'],  //多入口  打包为一个文件
		//entry:{app:'./app.js',app1:'./app1.js'},//多入口   打包为多个文件
		// entry: {
		// 	//app111:['babel-polyfill','./app.js'],
		// 	app111: './app.js',
		// 	app222: './app2.js'
		// },
		output: {
			filename: './js/[name].bundle.[chunkhash:1].js',//打包结果名称app111.asdsadasd323wdasd.js [name] 入口名称
			//filename:'bundle.js',//打包结果名称bundle.js
			//项目发布时，为了解决缓存，需要进行md5签名，这时候就需要用到 hash 和 chunkhash等。
			//[hash]hash字符串 :6  截取前六位hash   
			//还可以[name].[hash:6].[id][chunkhash].js   id就是打包资源的id chunkhash的一些东西
			path: __dirname + '/dist/src',//__dirname配置文件所在的文件路径 是一个绝对路径
			// publicPath:'45645645464'//告诉webpack  css  js 资源路径在哪里,引用路径变成publicPath+智能匹配的结果  如src="45645645464/./js/app111.4.js"
		},
		// optimization:{
		// 	//minize:true,//一般开发模式下不会压缩代码,置为true则压缩代码
		// 	splitChunks:{
		// 		name:true,//name直接设置为true那么打包出来的文件名称会与入口名称有关,
		// 		//name:"common",//改为字符串后,没有了文件名称的连接 但是发现依赖全部打包到一个common.js文件中了,如何拆分呢?cacheGroup属性
		// 		chunks:"initial",//all  对所有的同步代码提取处理   initial同步异步代码都会处理  async 只对异步代码进行处理
		// 		minSize:0,//默认小的不提取,大的才提取,设置为0  大于0的都提取
		// 		automaticNameDelimiter:"-",//改变文件名称之间连接的符号
		// 		cacheGroups:{
		// 			vendor:{
		// 				test:/[\\/]node_modules[\\/]/,
		// 				name:"vendor",
		// 				priority:-10,//common要求全部打包到common(默认层级为-10)中  这里要求单独打包vendor  所以需要priority属性来判断听谁的   数值越大  优先级越高  common(默认层级为-10)
		// 			},
		// 			// loader:{
		// 			// 	test:/loadsh/,
		// 			// 	name:"loadsh",
		// 			// 	priority:10,
		// 			// },
		// 			// modulea:{
		// 			// 	test:/modulea.js/,
		// 			// 	name:"modulea",
		// 			// 	priority:10,
		// 			// },
		// 			// moduleb:{
		// 			// 	test:/moduleb.js/,
		// 			// 	name:"moduleb",
		// 			// 	priority:10,
		// 			// },
		// 		}
		// 	},
		// 	runtimeChunk:{
		// 		name:'runtime'//单独打包出来webpack的运行文件,但是文件没有全部引入index.html  需要在插件chunks中配置
		// 	}
		// },
		module: {
			rules: [
				{
					test:/\.html$/,
					use:{
						loader:'html-loader',
						options:{
							attrs:["img:src","img:data-src","video:src"]//默认只会处理img的src属性   在这里自定义需要处理的属性
						}
					}
				},
				{
					test:/\.mp4$/,
					use:{
						loader:'url-loader',
						options:{
							outputPath:"assets/vedio",
							limit:5000//大于5k的视频不转base64
						}
					}
				},
				{
					test:/\.(png|jpg|jpeg|gif)$/,
					use:[
						{
							// loader:'file-loader',
							loader:'url-loader',//url-loader,有一个limit属性
							options:{
								//给图片命名 默认name:[hash].[ext] [ext]是文件后缀.png等
								name:'[name][hash:4].[ext]',
								//目的路径dist/assets/img
								outputPath:"assets/img",
								//output也有publicPath属性
								//作用是告诉webpack资源去哪里找,图片打包结果路径为publicPath+/文件名,不填写则智能匹配
								// publicPath:"asdasdasda", //结果为asdasdasda/dd0507f.jpg
								//一般与outputPath保持一致
								publicPath:"assets/img",
								limit:5000//大于5k的图片不转base64
							}
						},
						{
							loader:'img-loader',
							//imagemin 先下载这个包  imagemin-pngquant  压缩png图片  imagemin-mozjpeg   压缩jpeg  imagemin-gifsicle   压缩gif
							options:{
								plugins:[
									require('imagemin-pngquant')({
										speed:2 //值为1-11   数值越小  压缩越狠  一般为2-4之间
									}),
									require('imagemin-mozjpeg')({
										quality:60 //值为1-100   数值越小  压缩越狠  一般为60-80之间
									}),
									// require('imagemin-gifsicle')({
										// optimizationLevel:1//1 2 3   数值越大 压缩越狠    本身就很模糊 经不起压缩  一般为1 
									// })
								]
							}
						},
					]
				},
				{
					test: /\.js$/,//匹配.js结尾的文件
					exclude: '/node_modules/',
					// use:'babel-loader',
					//user:[{}],当对资源有多个处理的时候 用数组 里面是一个个的对象
					use: {
						// loader: 'babel-loader',//用happy代理babel-loader工作  代理的该loader的option必须移到new出来的happypack中
						loader:'happypack/loader?id=happybabel'
					},//use结果可以为字符串 数组 对象
				},
				{
					test: /\.tsx?$/,//匹配.ts结尾的文件
					exclude: '/node_modules/',
					use: {
						loader: 'ts-loader',
					},//use结果可以为字符串 数组 对象
				},
				//自定义con-loader
				{
					test: /\.cjj?$/,
					exclude: '/node_modules/',
					use: {
						loader: './cjj-loader',
					},
				},
				/*{
					// test:/\.css$/,
					test:/\.less$/,
					use:[
						{
							loader:'style-loader',
							options:{
								// insertAt:'top'//top bottom  相对于<head>的顶部和底部   (0.23.1版本有效)
								insertAt:{before:"#main"},  //对象的方式,指定在div的顶部和底部(一般不会去指定这个,仅作了解)(0.23.1版本有效)
								// insert:'#main',//插入到main中  但是引入app.js必须在#main之后(1.1.2)
								// insertInto:'#main'   (0.23.1版本有效)
								// singleton: true//将多个style标签合并为一个 (0.23.1版本有效)
								transform:"./transform.js"//(0.23.1版本有效)
							}
						},
						//执行顺序是从后往前,所以css-loader要先处理写在后面
						{
							loader:'css-loader',
							options:{
								// modules:true
								// webpack3写法 
								// modules:true,
								// localIdentName:'[path][name]_[local]_[hash:4]'
								// webpack4写法 
								//自定义类名为:路径+文件名+本来的类名(div)+4位hash=>结果为:css-index_main_fd4f css-index_borderBlue_71d2 css-a_border-yellow_dd19
								modules:{
									localIdentName:'[path][name]_[local]_[hash:4]'
								}
							}
						},
						// 处理less需要现用less-loader  从后往前加载 所以放在最后
						{
							loader:"less-loader"
						}
					]
				}*/
				//编译提取成一个css 改写如下
				// {
				// 	// test:/\.css$/,
				// 	test: /\.less$/,
				// 	use: extractTextCss.extract({
				// 		fallback: {
				// 			loader: 'style-loader',
				// 			options: {
				// 				insertAt: { before: "#main" },
				// 				transform: "./transform.js"
				// 			}
				// 		},
				// 		use: [
				// 			{
				// 				loader: 'css-loader',
				// 				options: {
				// 					// modules: {
				// 					// 	localIdentName: '[path][name]_[local]_[hash:4]'
				// 					// }
				// 				}
				// 			},
				// 			/* postcss-loader需要写在其它的预处理语言之前 */
				// 			{
				// 				loader: 'postcss-loader',
				// 				options: {
				// 					ident: 'postcss-loader',//接下来定义的plugin是给谁用的  这里ident应该是postcss而不是postcss-loader
				// 					plugins: [
				// 						//引用并调用
				// 						require('autoprefixer')(
				// 							// {
				// 							/* 指定编译目标 */
				// 							/* 像babel css3这些编译都需要指定目标,但是每一个都指定目标太麻烦,可能造成不统一,在
				// 							* 方法一:package.json中统一配置(推荐使用这种)
				// 							* 对于babel  autoprefixer这些需要指定overrideBrowserslist的都是有效的
				// 							* 方法二:新建.browserslistrc文件
				// 							 */
				// 							// webpack4写法:overrideBrowserslist 
				// 							// webpack3写法:Browserslist 
				// 							// "overrideBrowserslist":[
				// 							// 	">1%","last 2 versions"
				// 							// ]
				// 							// }
				// 						),
				// 						require('postcss-cssnext')(),//处理下一代css写法
				// 						// require('postcss-sprites')()
				// 					]
				// 				}
				// 			},
				// 			{
				// 				loader: "less-loader"
				// 			}
				// 		]
				// 	})
				// }
			]
		},
		devtool:'cheap-modules-source-map',
		devServer:{
			port:9001,//端口
			inline :true,//服务的开启模式 默认:true false 后页面会出现一个状态条,显示当前应用在编译状态还是在准备状态,在什么过程之中 一般情况下默认不设置
			// historyApiFallback :true,//直接开启
			historyApiFallback:{
				rewrites:[
					{
						from:/^\/([ -~]+)/,
						to:function(context){
							return './'+context.match[1]+'.html'
						}
					}
				]
			},
			overlay:true,//错误遮罩
			proxy:{
				//请求地址https://mooc.study.163.com/smartSpec/detail/1202851605.htm
				//碰到/smartSpec转发请求
				'/smartSpec	':{
					target:'https://mooc.study.163.com',//请求转发的目标地址
					changeOrigin:true,//改变origin
					pathRewrite:{
						//将/smartSpec/qd替换为/smartSpec/detail/1202851605.htm
						'^/smartSpec/qd':'/smartSpec/detail/1202851605.htm'
					},
					//添加请求头
					headers:{
						
					}
				}
			},
			hot:true,//开启热更新  优点:不刷新页面,保留原有状态
			hotOnly:true,//只是用热更新,不使用liveReload
		},
		plugins: [
			new HappyPack({
				id:'happybabel',
				loaders:['babel-loader?cacheDirectory=true']//简单写法
				/* loaders:[
					{
						path:'babel-loader',
						cache:true,
						//共享进程池
						threadPool: happyThreadPool,
						//允许 HappyPack 输出日志
						verbose: true
					}
				] */
			}),
			// new
			//     webpack.DefinePlugin({
			//         'process.env':
			//         require('../config/dev.env')
			//     }),
			// new
			//     webpack.HotModuleReplacementPlugin(),

			// new extractTextCss({
			// 	/* 命名类似于entry的命名 */
			// 	filename: '[name].min.css',
			// 	disable:false,//禁用    热更新与extract-text-webpack-plugin不兼容,禁用extract-text-webpack-plugin
			// }),
			new htmlWebpackPlugin({
				filename: "index.html",//必填项
				template: "./index.html",//无法凭空产生一个html,以本地的html为模板
				minify: {
					collapseWhitespace: false//是否压缩
				},
				inject: true,//是否自动引入html
				chunks: [
					'app111',//html中自动引入指定个入口打包出来的js
					'runtime',
					'common',//第一个页面引入了公共文件 第二个就不用了
					'vendor',
					'moduleb'
				],
				defaultAttr:'我是自定义的属性',
				vendorPath:"../dll/vendor.js"
			}),
			// new htmlWebpackPlugin({
			// 	filename: "index2.html",//必填项
			// 	template: "./index2.html",//无法凭空产生一个html,以本地的html为模板
			// 	minify: {
			// 		collapseWhitespace: false//是否压缩
			// 	},
			// 	inject: true,//是否自动引入html
			// 	chunks: [
			// 		'app222',//html中自动引入指定个入口打包出来的js
			// 		'runtime',
			// 		'vendor'
			// 	],
			// 	defaultAttr:'我是自定义的属性'
			// }),
			new webpackSpriteSmith({
				src:{
					cwd:path.join(__dirname,"./img"),//打包src/assets/img文件夹下的图片
					glob:"*.jpg"//src/assets/img文件夹下需要处理哪种类型的图片  也可以写单独的图片img1.jpg
				},
				//指定打包的图片和css的位置和名称
				target:{
					image:path.join(__dirname,"dist/sprites/sprites.png"),
					css:path.join(__dirname,"dist/sprites/sprites.css")
				},
				//告诉我们去哪里找打包好的图片
				apiOptions:{
					cssImageRef:"./sprites.png"
				}
			}),
			new webpack.DllReferencePlugin({
				manifest:require('./dist/dll/vendor.json')//该路径是以打包结果为起始的
			}),
			// new wba(),//分析工具
			new CleanWebpackPlugin()
		]
	}