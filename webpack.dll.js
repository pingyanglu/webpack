const webpack=require('webpack');
module.exports={
  entry:{
  	vendor:["jquery",'loadsh'],
 
  },
  output:{
    path:__dirname+"/dist/dll",
    filename:"./[name].js",
    //引用名
    library: '[name]_library'
  },
  plugins:[
     new webpack.DllPlugin({
      path:__dirname+"/dist/dll/[name].json",
      name:"[name]_library"//这里名称必须和上面output.library名称相同
     })
  ]  
}