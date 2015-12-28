
;(function($, undefined) { 
	"use strict";
	
	function Nv(s){//浏览器版本
		var n=navigator.userAgent,v;
		if(s){
			if(n.indexOf(s)>=0){
				v=true;
			}else{
				v=false;
			}
		}else if(n.indexOf("Chrome")>=0){
			v=1;
		}else if(n.indexOf("Safari")>=0){
			v=2;
		}else if(n.indexOf("Firefox")>=0){
			v=3;
		}else if(n.indexOf("Opera")>=0){
			v=4;
		}else{
			var r=/.+?MSIE (\d+)\.0.+/;
			if(r.test(n)){
				v=parseInt(n.replace(r,"$1"));
				if(v<5)v=0;
			}else{
				v=0;
			}
		}
		return v;
	}

	function Sw(i,s){//切换 i=对像,s设置透明度
		if(i.tm)clearTimeout(i.tm);
		var p;//透明度
		if(Nv()<5||Nv()>=9){
			p=i.style.opacity*100;
		}else{
			var r=/^alpha\(opacity\=(\d+)\)$/i;
			p=i.style.filter;
			if(r.test(p))p=parseInt(p.replace(r,"$1"));
		}
		if(typeof p!="number")p=100;
		p+=s;
		if(s>0){
			if(i.style.display=="")i.style.display="block";
			if(p>100)p=100;
			if(p<100)i.tm=setTimeout(function(){Sw(i,s);},30);//显示速度
		}else{
			if(p<0)p=0;
			if(p==0){
				i.style.display="";
			}else{
				i.tm=setTimeout(function(){Sw(i,s);},30);//隐藏速度
			}
		}
		if(Nv()<5||Nv()>=9){
			i.style.opacity=p/100;
		}else{
			i.style.filter="alpha(opacity="+p+")";
		}
	}
	
	/** 获取已经上传的图片的可访问地址字符串（多张图片地址用','隔开），用于保存到数据库 */
	$.fn.zImgslider_getImgUrls = function(basePath) {
		var t = "#" + $(this).attr("id") + " img";
		return $(t).map(
				function() {
					var src = $(this).attr("srctemp");
					if (basePath && basePath != '' && src && src != '') {
						return src.replace(basePath,"");
					} else {
						return src;
					}
				}
		).get().join(",");
	};
	
	/** 初始化渲染图片(如果只用于显示，则不用传modify参数) */
	$.fn.zImgslider_init = function(basePath, imgs, modify) {
		var imgId = $(this).attr("id");
		$("#"+imgId).addClass("playPhoto").append("<ul></ul>");
		$("#"+imgId+" ul").empty();
		$("#"+imgId+" ol").remove();
		if (imgs == null || imgs == "") {
			$("#"+imgId).hide();
			return;
		} else {
			var values = imgs.split(",");
			for (var i=0; i<values.length; i++) {
				addPhoto(imgId,basePath+values[i],"","",modify);
			}
		}
	};
	
	/** 添加一张图片(如果新上传的图片覆盖前面的，则count传入1；如果限定指定张数，则count传入允许的数量) */
	$.fn.zImgslider_addImg = function(basePath, img, count) {
		var imgId = $(this).attr("id");
		if (count && count==1) {// 只能上传一张
			$("#"+imgId+" > ul:first > li").remove();
			addPhoto(imgId,basePath+img,"","",true);
		} else if(count && $("#"+imgId+" > ul:first > li").size() >= count) {// 只能上传指定张数
			alert("照片数过多,请删除后再试!");
		} else {
			addPhoto(imgId,basePath+img,"","",true);
		}
		return;
	};
	
	function addPhoto(d,url,title,size,modify){ //上传照片
		var imgHtml = "<li>"+"<a href='"+url+"' target='_blank' title='点击查看原图'><img srctemp='"+url+"' src='"+url+"' title='点击查看原图' /></a>"+"</li>";
		$("#"+d+" > ul:first").append(imgHtml);
		$("#"+d).show();
		playPhoto(d,modify);
	}

	function delPhoto(d,i){ //删除图片
		$("#"+d+" > ul:first > li:eq("+i+")").remove();
		playPhoto(d,true);
	}

	function playPhoto(d,modifying){ //d=Object或者id
		if(typeof d=="string")d=document.getElementById(d);
		if(typeof d!="object")return;
		d.ul=d.getElementsByTagName("ul")[0];
		if(!d.ul)return;
		d.ul.li=d.ul.getElementsByTagName("li");
		d.ol=d.getElementsByTagName("ol");
		if(d.ol.length==0){
			d.ol=document.createElement("ol");
			d.insertBefore(d.ol,null);
		}else{
			d.ol=d.ol[0];
		}
		if (modifying) {
			/*if(!d.frontCover){
				d.frontCover=document.createElement("s");
				d.frontCover.className="frontCover";
				d.frontCover.innerHTML="设为封面";
				d.frontCover.title="设为封面";
				d.insertBefore(d.frontCover,null);
			}*/
			if(!d.delPhoto){
				d.delPhoto=document.createElement("s");
				d.delPhoto.className="delPhoto";
				d.delPhoto.innerHTML="删除图片";
				d.delPhoto.title="删除图片";
				d.insertBefore(d.delPhoto,null);
			}
		}

		if(d.ul.li.length==0){
			d.ol.innerHTML="";
			if (modifying) {
				/*d.frontCover.style.display="";*/
				d.delPhoto.style.display="";
			}
			return;
		}
		var h="";
		
		for(var i=0;i<d.ul.li.length;i++){
			if(d.ul.li.length==1){
				h="<li style='display:none' class='act'></li>";
			}else{
				if(i==0){
					h="<li class='act'>1</li>";
				}else{
					h+="<li>"+(i+1)+"</li>";
				}
			}
		}
		d.ol.innerHTML=h;
		d.ol.li=d.ol.getElementsByTagName("li");

		if (modifying) {
			/*d.frontCover.onmouseover=function(){this.style.color="#f60";};
			d.frontCover.onmouseout=function(){this.style.color="";};
			
			d.frontCover.onclick=function(){
				for(var i=0;i<d.ol.li.length;i++){
					if(d.ol.li[i].className=="act"){
						frontCover(d.ul.li[i].getElementsByTagName("img")[0].src);	// 设为封面回调函数
						break;
					}
				}
			};*/

			d.delPhoto.onmouseover=function(){this.style.color="#f60";};
			d.delPhoto.onmouseout=function(){this.style.color="";};
			d.delPhoto.onclick=function(){
				if (window.confirm("确认删除此图片？")) {
					for(var i=0;i<d.ol.li.length;i++){
						if(d.ol.li[i].className=="act"){
							delPhoto(d.id,i);
							break;
						}
					}
				}
			};
		}

		d.ul.li[0].style.display="block";
		d.py=function(t){//播放
			if(d.sp){
				if(d.tm)clearTimeout(d.tm);
				if(typeof t!="number"){
					if(d.ix>=d.ol.li.length-1){
						t=0;
					}else{
						t=d.ix+1;
					}
				}
				d.ix=t;
				for(var i=0;i<d.ol.li.length;i++){
					if(i==t){
						Sw(d.ul.li[i],10);
						d.ol.li[i].className="act";
					}else{
						Sw(d.ul.li[i],-10);
						d.ol.li[i].className="";
					}
				}
				d.tm=setTimeout(d.py,3000);//连续播放间隔
			}
		};
		d.onmouseover=function(){//鼠标悬停时停止播放
			d.sp=null;
			if(d.tm)clearTimeout(d.tm);
			if(d.ul.li.length>0){
				if (modifying) {
					// d.frontCover.style.display="inline";
					d.delPhoto.style.display="inline";
				}
			}
		};
		d.onmouseout=function(){//鼠标离开时播放
			d.sp=1;
			d.tm=setTimeout(d.py,3000);
			if (modifying) {
				// d.frontCover.style.display="";
				d.delPhoto.style.display="";
			}
		};
		for(var i=0;i<d.ol.li.length;i++){//切换数字对像事件
			d.ol.li[i].onmouseover=function(){
				for(var s=0;s<d.ol.li.length;s++){
					if(d.ol.li[s]==this){
						d.sp=1;
						d.py(s);
						break;
					}
				}
			};
		}
		d.ix=0;
		d.sp=1;
		d.py(d.ix);//初始化
	}

})(jQuery);