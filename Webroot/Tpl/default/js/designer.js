<!--
var speed=10; //数字越大速度越慢
var tab=document.getElementById("imgs");
var tab1=document.getElementById("imgturn1");
var tab2=document.getElementById("imgturn2");
tab2.innerHTML=tab1.innerHTML;
var page=568;
function Marquee(){

	//alert(tab.scrollLeft+'----'+tab1.offsetWidth+'---'+tab2.offsetWidth);
	
	if (tab.scrollLeft == 0 || tab.scrollLeft % page == 0) {
		clearInterval(MyMar);
		
		MyMar = setInterval(Marquee, 2000);
	}
	else {
		clearInterval(MyMar);
		MyMar = setInterval(Marquee, speed);
	}
	
//	if(tab2.offsetWidth-tab.scrollLeft>=page)
//		tab.scrollLeft+=tab1.offsetWidth;
//	else
//		tab.scrollLeft--;
	 if(tab2.offsetWidth-tab.scrollLeft<=0){ 
  tab.scrollLeft-=tab1.offsetWidth 
	}
	else {
	
	
		tab.scrollLeft++;
	}
}
var MyMar = setInterval(Marquee, speed);
	tab.onmouseover = function(){
		clearInterval(MyMar);
	};
	tab.onmouseout = function(){
		MyMar = setInterval(Marquee, speed)
	};
	
	
	var turnlr = function(turn){
		clearInterval(MyMar);
		
		var length = parseInt((tab1.offsetWidth + tab2.offsetWidth) / page);
		var result1 = parseInt(tab.scrollLeft / page);//防止临界值 //计算轮换到第几张图片
		if (turn == 'left') {
			if (tab.scrollLeft <= 1) {//初始0状态
			 tab.scrollLeft=(tab1.offsetWidth-page);
			}
			else {//0-1之间
				tab.scrollLeft = tab.scrollLeft - (page + tab.scrollLeft % page);
			}
		}
		else {
			tab.scrollLeft = tab.scrollLeft+(page - tab.scrollLeft % page);
		}
		
		MyMar = setInterval(Marquee, speed);
	}
