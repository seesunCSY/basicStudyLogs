/***********behavior模式，定义preview行为********/
function setPreviewBehavior(subjects){
	//将对象转化成对象数组
	if(!Array.isArray(subjects){
		if(subjects.length) subjects = Array.from(subjects);
		else subjects = [subjects];
	}
	//创建事件
	var previewEvent = document.createEvent('Event');
	previewEvent.initEvent('preview', true, true);
	//设置事件触发目标
	previewEvent.previewTargets = subjects.map(function(evt){
		return evt.src;
	});
	//遍历对象数组，数组每一项具有preview方法
	subjects.forEach(function(subject){
		sunject.preview = function(){
			sunject.dispatchEvent(previewEvent);
		}
	})
}
/************/
var imgList = document.getElementById('list');
var imgs = document.querySecletorAll('ul img');
