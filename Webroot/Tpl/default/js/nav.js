
if (typeof(HTMLElement) != "undefined") 
HTMLElement.prototype.contains = function(obj){
    if (obj == this) 
        return true;
    if (obj != null) {
        while (obj = obj.parentNode) 
            if (obj == this) 
                return true;
    }
    return false;
}
var autobg = '';//定时调用方法
var autobg2 = '';//定时调用方法
function changelogobgout(name, color, obj){
//    imageflag = 0;
        //	clearInterval(autobg);
       // autobg = setInterval(autoChangebg, 1000);
    obj.src = 'Webroot/Tpl/default/images/' + name + color + '.png';
    //		document.getElementById('sourcelogos').style.backgroundImage ="url('Webroot/Tpl/default/images/"+name+"bg.jpg')";
}
function changealllogo(){
//	if (autobg != '') {
	 var result = imageflag!=0?imageflag-1:0;
	     var bgimages = document.getElementById('logos').getElementsByTagName('img');//所有商标
		 	 oldimagesname = bgimages[result].src.replace('gray.png','black.png');//图片名字；
    bgimages[result].src = oldimagesname;
		clearInterval(autobg);
		autobg2=setInterval(autoChangebg2, '2500');
//	}
}
function changelogobgover(name, color, obj,num){
clearInterval(autobg2);
    clearInterval(autobg);//停止自动换图
    var bgimages = document.getElementById('logos').getElementsByTagName('img');//所有商标
	 var result = imageflag!=0?imageflag-1:0;
	     var bgimages = document.getElementById('logos').getElementsByTagName('img');//所有商标
		 	var oldimagesname = bgimages[result].src.replace('black.png','gray.png');//图片名字；
    bgimages[result].src = oldimagesname;
	  obj.src = 'Webroot/Tpl/default/images/' + name + color + '.png';
    document.getElementById('alllogos').style.backgroundImage = "url('Webroot/Tpl/default/images/" + name + "bg.jpg')";
		imageflag = num;
		  oldimagesname = bgimages[imageflag].src.replace('gray.png','black.png');//图片名字；
    bgimages[imageflag].src = oldimagesname;
	imageflag++;
}

function shownav(id){
		
        clearInterval(autobg);
        clearInterval(autobg2);
		  var bgimages = document.getElementById('logos').getElementsByTagName('img');//所有商标
    if (id == 'alllogos') {
				bgimages[0].src=bgimages[imageflag].src.replace('gray.png','black.png');
        autobg = setInterval(autoChangebg, '2500');
        
    }
    else {
     var result = imageflag!=0?imageflag-1:0;
	 	var oldimagesname ='';
	 oldimagesname = bgimages[result].src.replace('black.png','gray.png');//图片名字；
 bgimages[result].src = oldimagesname;
        imageflag = 0;
				  var dabg = document.getElementById('alllogos');//品牌大图背景
	  dabg.style.backgroundImage = 'url('+bgimages[imageflag].src.replace('gray.png','bg.jpg')+')';
    }
	
    document.getElementById('alllogos').style.display = 'none';
    document.getElementById('connectus').style.display = 'none';
    document.getElementById('showus').style.display = 'none';
    document.getElementById(id).style.display = '';
}

function discovernav(evt,id){ //显示
    clearInterval(autobg);//停止自动换图
    clearInterval(autobg2);//停止自动换图
    evt = window.event ? window.event : evt;
    var obj = evt.toElement || evt.relatedTarget
    if (document.getElementById(id).contains(obj)) 
        return;//阻止事件冒泡的关键代码
    document.getElementById(id).style.display = 'none';
	  var bgimages = document.getElementById('logos').getElementsByTagName('img');//所有商标
	 var result = imageflag!=0?imageflag-1:0;
		 	 oldimagesname = bgimages[result].src.replace('black.png','gray.png');//图片名字；
    bgimages[result].src = oldimagesname;
	imageflag=0;
	
		  var dabg = document.getElementById('alllogos');//品牌大图背景
	   dabg.style.backgroundImage = 'url('+bgimages[imageflag].src.replace('gray.png','bg.jpg')+')';
    /*要执行的操作*/


}

var imageflag = 0;//图片背景初始值
var oldimageflag = 0;
autoChangebg = function(){//自动更改背景
//console.log(111)
    var bgimages = document.getElementById('logos').getElementsByTagName('img');//所有商标
    var imageslength = bgimages.length;//图片数
    var dabg = document.getElementById('alllogos');//品牌大图背景
	 var result = imageflag!=0?imageflag-1:0;
		 	 oldimagesname = bgimages[result].src.replace('black.png','gray.png');//图片名字；
    bgimages[result].src = oldimagesname;
    if (imageflag >= imageslength) {
    
        imageflag = 0;//改变为初始值
    }
    var imagesstar = bgimages[imageflag].src.lastIndexOf('/');
    var imagesend = bgimages[imageflag].src.lastIndexOf('.');
    var imagesname = bgimages[imageflag].src.substring(imagesstar + 1, imagesend - 4);//图片名字；
    bgimages[imageflag].src = 'Webroot/Tpl/default/images/' + imagesname + 'black.png'
    dabg.style.backgroundImage = 'url(Webroot/Tpl/default/images/' + imagesname + 'bg.jpg)';
    
    imageflag++;
    
}
autoChangebg2 = function(){//自动更改背景
//console.log(111)
    var bgimages = document.getElementById('logos').getElementsByTagName('img');//所有商标
    var imageslength = bgimages.length;//图片数
    var dabg = document.getElementById('alllogos');//品牌大图背景
   	 var result = imageflag!=0?imageflag-1:0;
		 	 oldimagesname = bgimages[result].src.replace('black.png','gray.png');//图片名字；
    bgimages[result].src = oldimagesname;
    if (imageflag >= imageslength) {
    
        imageflag = 0;//改变为初始值
    }
    var imagesstar = bgimages[imageflag].src.lastIndexOf('/');
    var imagesend = bgimages[imageflag].src.lastIndexOf('.');
    var imagesname = bgimages[imageflag].src.substring(imagesstar + 1, imagesend - 4);//图片名字；
    bgimages[imageflag].src = 'Webroot/Tpl/default/images/' + imagesname + 'black.png'
    dabg.style.backgroundImage = 'url(Webroot/Tpl/default/images/' + imagesname + 'bg.jpg)';
    
    imageflag++;
    
}