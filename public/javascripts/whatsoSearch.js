document.onkeydown = function(event){
    var e = event || window.event ||arguments.callee.caller.arguments[0];
    if(e && e.keyCode == 13){
        //$('#whatso_signin').click();
    }
}
document.getElementById("Operation").classList.value="whatso-span-scope active";
var lastTime = new Date().getTime();
var currentTime = new Date().getTime();
var timeOut = 600 * 1000 * 60; //设置超时时间： 1小时
$(document).ready(function(){
/* 鼠标移动事件 */
$(document).mousemove(function(){
lastTime = new Date().getTime(); //更新操作时间

});
});

function assumeTime(){
currentTime = new Date().getTime(); //更新当前时间
if(currentTime - lastTime > timeOut){ //判断是否超时
   window.location.href="/";
}
}
/* 定时器 间隔1秒检测是否长时间未操作页面 */
window.setInterval(assumeTime, 1000);

var whatsoSearch=(function(){
    var selectScope=null;
    return{
        init:init,
        whatsoScopeToggle:whatsoScopeToggle,
        whatsoSearchToggle:whatsoSearchToggle
    }
    function init(){

    }
    function whatsoSearchToggle(obj,evt){
        var container=$(obj).closest('.whatso-search-wrapper');
        if(!container.hasClass('active')){
            container.addClass('active');
            document.getElementById('whatso_ContentParent').classList.value="whatso-result-display active";
            evt.preventDefault();
        }
        else if(container.hasClass('active')&& $(obj).closest('.whatso-input-holder').length==0){
            document.getElementById('whatso_ContentParent').classList.value="whatso-result-display";
            container.removeClass('active');
            container.find('.whatso-search-input').val('');
        }
    }
    function whatsoScopeToggle(obj,evt,id){
        var myback=document.getElementById("backScope1");
        if(id=="Operation"){
        	myback.style = "background:url('/images/oper.jpg'); background-size:cover;";
            document.getElementById("PCMS").classList.value="whatso-span-scope";
            document.getElementById("ENG").classList.value="whatso-span-scope";
        }else if(id=="PCMS"){
            myback.style = "background:url('/images/pcms_1.jpg'); background-size:cover;";
            document.getElementById("Operation").classList.value="whatso-span-scope";
            document.getElementById("ENG").classList.value="whatso-span-scope";
        }else if(id=="ENG"){
            myback.style = "background:url('/images/eng_1.jpg'); background-size:cover;";
            document.getElementById("PCMS").classList.value="whatso-span-scope";
            document.getElementById("Operation").classList.value="whatso-span-scope";
        }
        var container=$(obj).closest('.whatso-span-scope');
        if(!container.hasClass('active')){
            container.addClass('active');
            evt.preventDefault();
        }
        else if(container.hasClass('active')){
            container.removeClass('active');
        }
    }
}());


function img_tip(){
	layer.tips('Whatso is a cognitive search engine.We can provide directional search service according to the different functions.If you do not believe it, come and have a try.', '#home', {
		tips: [1, '#393D49'],
		time: 4000
	});
}
function video_tip(){
	layer.tips('Click to see the intro video of Whatso.', '#about', {
		tips: [1, '#393D49'],
		time: 2000
	});
}
var loadstr='<video width="100%" height="100%"  controls="controls" autobuffer="autobuffer" loop="loop" style="position:fixed!important;top:0;left:0;"><source src="/images/Whatso.mp4" type="video/mp4"></source></video>';
function func_video() {
	layer.open({
		type : 1,
		title : false,
		area : [ '911px', '363px' ],
		shade : 0.8,
		closeBtn : 0,
		shadeClose : true,
		content : loadstr
	});
	layer.msg('Click anywhere to close');
}


function oper(){
	document.getElementById("oper_link").className = "changecolor";
	document.getElementById("pcms_link").className = "staycolor";
	document.getElementById("eng_link").className = "staycolor";
}
function pcms(){
	document.getElementById("oper_link").className = "staycolor";
	document.getElementById("pcms_link").className = "changecolor";
	document.getElementById("eng_link").className = "staycolor";
}
function eng(){
	document.getElementById("oper_link").className = "staycolor";
	document.getElementById("pcms_link").className = "staycolor";
	document.getElementById("eng_link").className = "changecolor";
}








