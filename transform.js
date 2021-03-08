module.exports=function (css){
	if(window.screen.width<500){
		console.log('css',css)
		css=css.replace('red','green');
	}
	return css;
}