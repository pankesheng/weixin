
var zutil = {};

//图片居中显示 zutil.drawImage($("#img1"),80,60);
zutil.drawImage = function (ImgD,iwidth,iheight) {
	var image=new Image();
	image.src=ImgD.src;
	if(image.width > 0 && image.height > 0){
		if(image.width/image.height >= iwidth/iheight){
			if(image.width>iwidth){
				ImgD.width=iwidth;
				ImgD.height=(image.height*iwidth)/image.width;
			}else{
				ImgD.width=image.width;
				ImgD.height=image.height;
			}
			$(ImgD).css({"margin-top":(iheight - ImgD.height) / 2,"margin-left":(iwidth - ImgD.width) / 2});
		}
		else{
			if(image.height>iheight){
				ImgD.height=iheight;
				ImgD.width=(image.width*iheight)/image.height;
			}else{
				ImgD.width=image.width;
				ImgD.height=image.height;
			}
			$(ImgD).css({"margin-top":(iheight - ImgD.height) / 2,"margin-left":(iwidth - ImgD.width) / 2});
		}
	}
}

// 判断是否为微信浏览器
zutil.weixinBrowser = function() {
	var ua = navigator.userAgent.toLowerCase();
    return (ua.match(/MicroMessenger/i)=="micromessenger");
}

// 判断是否为手机浏览器
zutil.mobileBrowser = function() {
	return (!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/));
}

/**
 * 获取浏览器内核类型和版本号，返回JSON对象(如：{btype:"ie",bversion:"9.0"})
 * 依赖 jquery-1.8.1.min.js 和 jquery.ua.js。不支持jquery-1.9。
 */
zutil.browser = function() {
	var btype = "";
	if ($.ua.isChrome) {
		btype = "chrome";
	} else if ($.ua.isFirefox) {
		btype = "firefox";
	} else if ($.ua.is360se) {
		btype = "360se";
	} else if ($.ua.is360ee) {
		btype = "360ee";
	} else if ($.ua.isLiebao) {
		btype = "liebao";
	} else if ($.ua.isSougou) {
		btype = "sougou";
	} else if ($.ua.isQQ) {
		btype = "qq";
	} else if ($.ua.isMaxthon) {
		btype = "maxthon";
	} else if ($.ua.isIe) {
		btype = "ie";
	}
	
	if (btype != "") {
		return {btype: btype, bversion: $.browser.version};
	} else {
		return zutil.browser_base();
	}
}

/** 
 * @deprecated
 * 无法识别外壳，由browser()方法代替。
 * 获取浏览器内核类型和版本号，返回JSON对象(如：{btype:"ie",bversion:"9.0"})
  */
zutil.browser_base = function() {
	var browserParams = {btype:"",bversion:""};
    var sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
    if (sys.ie) {
    	browserParams.btype = "ie";
    	browserParams.bversion = sys.ie;
    } else if (sys.firefox) {
    	browserParams.btype = "firefox";
    	browserParams.bversion = sys.firefox;
    } else if (sys.chrome) {
    	browserParams.btype = "chrome";
        browserParams.bversion = sys.chrome;
    } else if (sys.opera) {
    	browserParams.btype = "opera";
    	browserParams.bversion = sys.opera;
    } else if (sys.safari) {
    	browserParams.btype = "safari";
    	browserParams.bversion = sys.safari;
    }
    return browserParams;
}
