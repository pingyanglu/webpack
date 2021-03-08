module.exports = {
	root:true,
	env:{
		browser:true
	},
	extends:[
		'standard',//标准中的标准
		'plugin:vue/essential'
	],
	plugins:['html','vue'],//插件的使用
	rules:{
		//100多条   自己配置自己的风格
		'no-debugger':'off',
		'no-console':'off',
	}
}