var extractTextCss = require('extract-text-webpack-plugin')
module.exports={
    //entry:'./app.js', //单入口
    // entry:['./app.js','./app1.js'],  //多入口  打包为一个文件
    //entry:{app:'./app.js',app1:'./app1.js'},//多入口   打包为多个文件
    entry:{
        //app111:['babel-polyfill','./app.js'],
        app111:'./app.js'
    },
    output:{
        filename:'./js/[name].[hash:1].js',//打包结果名称app111.asdsadasd323wdasd.js [name] 入口名称
        //filename:'bundle.js',//打包结果名称bundle.js
        //项目发布时，为了解决缓存，需要进行md5签名，这时候就需要用到 hash 和 chunkhash等。
        //[hash]hash字符串 :6  截取前六位hash   
        //还可以[name].[hash:6].[id][chunkhash].js   id就是打包资源的id chunkhash的一些东西
        path:__dirname+'/src/mybuild',//__dirname配置文件所在的文件路径 是一个绝对路径
    },
    module:{
        rules:[
            {
                test:/\.js$/,//匹配.js结尾的文件
                exclude:'/node_modules/',
                // use:'babel-loader',
                //user:[{}],当对资源有多个处理的时候 用数组 里面是一个个的对象
                use:{
                    loader:'babel-loader',
                },//use结果可以为字符串 数组 对象
            },
            {
                test:/\.tsx?$/,//匹配.ts结尾的文件
                exclude:'/node_modules/',
                use:{
                    loader:'ts-loader',
                },//use结果可以为字符串 数组 对象
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
			{
				// test:/\.css$/,
				test:/\.less$/,
				use:extractTextCss.extract({
					fallback:{
						loader:'style-loader',
						options:{
							insertAt:{before:"#main"}, 
							transform:"./transform.js"
						}
					},
					use:[
						{
							loader:'css-loader',
							options:{
								modules:{
									//便于阅读编译后的css类名
									localIdentName:'[path][name]_[local]_[hash:4]'
								}
							}
						},
						/* postcss-loader需要写在其它的预处理语言之前 */
						{
							loader:'postcss-loader',
							options:{
								ident:'postcss-loader',//接下来定义的plugin是给谁用的
								plugins:[
									//引用并调用
									require('autoprefixer')(
										// {
										/* 指定编译目标 */
										/* 像babel css3这些编译都需要指定目标,但是每一个都指定目标太麻烦,可能造成不统一,在
										* 方法一:package.json中统一配置(推荐使用这种)
										* 对于babel  autoprefixer这些需要指定overrideBrowserslist的都是有效的
										* 方法二:新建.browserslistrc文件
										 */
										// webpack4写法:overrideBrowserslist 
										// webpack3写法:Browserslist 
										// "overrideBrowserslist":[
										// 	">1%","last 2 versions"
										// ]
									// }
									),
									require('postcss-cssnext')()//处理下一代css写法
								]
							}
						},
						{
							loader:"less-loader"
						}
					]
				})
			}
        ]
    },
    plugins:[
        // new
        //     webpack.DefinePlugin({
        //         'process.env':
        //         require('../config/dev.env')
        //     }),
        // new
		//     webpack.HotModuleReplacementPlugin(),
		new extractTextCss({
			/* 明明类似于entry的命名 */
			filename:'[name].min.css'
		})
    ]
}

