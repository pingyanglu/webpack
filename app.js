// import 'babel-polyfill'
import './test.ts'
// import a from './css/a.css'
// import index from './css/index.css'
import a from './css/a.less'
import index from './css/index.less'
import f1 from './module1.js'
/* 引入自定义的.cjj文件 */
import  './cjj/index.cjj'
//loadsh
import lod from "loadsh";

import ma from "./modulea.js";
import * as mb from "./moduleb.js";
ma.a();
mb.a();
//tree-shaking
//基于export文档流
//函数式编程更有利于tree-shaking

//异步模块
//方法一:import
//import(/*webpackChunkName:'moduleb'*/'./moduleb.js').then(function(res){
	
//});//动态的获取module3.js    vue 中的异步组件这种写法也是webpack提供的   通过魔法注释命名 这样就会打包出来一个moduleb.js  并且在app111.js中异步加载
//方法二:require.ensure
/* require.ensure(['jquery'],function($){
	require('./moduleb.js')
},'moduleb2')//第三个参数用来改名 */


f1();
let b=2;
new Promise(function(){
	setTimeout(()=>{})
})
async function Fn(){}

/* 设置页面中的类名为编码后的类名,但是导致类名不好阅读,于是在loader中配置规则*/
document.getElementById('main').setAttribute('class',index.main);
// document.getElementById('img1').setAttribute('class',index.img1);
// document.getElementById('img3').setAttribute('class',index.img3);
var i = 0;
setInterval(() => {
	i++;
	document.getElementById('main').innerHTML=i+'a1';
}, 1000);
// console.log(p.ha);//错误信息定位示例
if(module.hot){
	module.hot.accept();
}

// 如果非要在js中引入图片
import img from './img/img3.jpg'
var image = new Image();
image.src = img;
document.getElementById('img2').appendChild(image);
console.log(666)