
// 功能：
// 		1、注册AJAX事件：如果 ajax 请求返回 s=2，则转到登录页（登录页地址默认为"/login.jsp"；如需修改，可在引入zcommon.js时传递loginpath参数）
//		2、初始化控件：初始化所有 class="form-select" 的下拉框控件
// 用法：
//		登录页(JSP)
//			<script type="text/javascript" src="<%=request.getContextPath() %>/ext/jquery/jquery-1.8.1.min.js"></script>
//			<script type="text/javascript" src="<%=request.getContextPath() %>/admin/ext/jquery/selectbox.js"></script>
//			<script type="text/javascript" src="<%=request.getContextPath() %>/admin/javascripts/zcommon.js?v=1" basepath="<%=request.getContextPath() %>" baseinit="iframeCheckLogin"></script>
//		其他页(FTL)
//			<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
//			<script type="text/javascript" src="${contextPath}/admin/ext/jquery/selectbox.js"></script>
//			<script type="text/javascript" src="${contextPath}/admin/javascripts/zcommon.js?v=${sversion}" basepath="${contextPath}" baseinit="ajaxCheckLogin"></script>




var _z_basepath=$("script:last").attr("basepath")||"";
var _z_loginpath=$("script:last").attr("loginpath")||"/login.jsp";
var _z_baseinit=$("script:last").attr("baseinit")||"";

if (_z_baseinit == "iframeCheckLogin") {
	z_iframeCheckLogin(_z_basepath+_z_loginpath);
} else if (_z_baseinit == "ajaxCheckLogin") {
	z_ajaxCheckLogin(_z_basepath+_z_loginpath);
}

$(document).ready(function(){
	$('.form-select').each(function(index, el) {
		selectbox(this);
	});
});

function z_ajaxCheckLogin(loginPage) {
	$(document).ajaxSuccess(function(evt, request, settings){
		   var d=jQuery.parseJSON(request.responseText);
		   if(d.s==2){
			   var ws=_getParents();
			   var w=ws.pop();
			   if(w) {
				   w.location.href=loginPage;
			   } else {
				   window.location.href=loginPage;
			   }
		   }
	});
}

function z_iframeCheckLogin(loginPage) {
	var ws=_getParents();
	var w=ws.pop();
	if(w) {
		w.location.href=loginPage;
	}
}

function _getParents(w){
	w=w||window;
	var p=w.parent,ws=[];
	while(p!=w&&p){
	   ws.push(p);
	   w=p;p=p.parent;
	}
	return ws;
}

// 初始化图片上传功能
// 	用法：
//		z_initImgUpload("upload1", "addOrModify_imgs", "${contextPath}", "Downloads-zt", 1);
//	后台默认接收地址：
//		${contextPath}/file/upload.ajax
//	上传完之后：
//		调用zimgslider显示图片
//	依赖：
//		<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
//		<script type="text/javascript" src="${contextPath}/ext/json/json2.js"></script>
//		<link rel="stylesheet" type="text/css" href="${contextPath}/admin/ext/uploadify/uploadify.css" media="screen" />
//		<script type="text/javascript" src="${contextPath}/admin/ext/uploadify/jquery.uploadify.min.js?t=<@z.z_now />"></script>
//		<link rel="stylesheet" href="${contextPath}/ext/jquery_zcj/jquery.zimgslider.css?v=${sversion}" />
//		<script type="text/javascript" src="${contextPath}/ext/jquery_zcj/jquery.zimgslider.js?v=${sversion}"></script>
function z_initImgUpload(uploadButtonId, imgListId, basePath, saveCatalog, maxCount) {
	
	var multi = false;
	if (maxCount && maxCount > 1) {
		multi = true;
	}
	
	$('#'+uploadButtonId).uploadify({
		
		uploader: basePath+'/file/upload.ajax',
		formData: { type: saveCatalog },
		swf: basePath+'/admin/ext/uploadify/uploadify.swf',
		
		buttonText: '上传图片',
		buttonClass: 'btn btn-primary no-padding',
		removeTimeout: 0.1,
		width : 70,
		height : 30,
		
		multi: multi,
		fileSizeLimit: '20MB',// 文件大小限制
		fileTypeExts: '*.gif;*.jpg;*.png;*.bmp;*.jpeg',// 默认为所有类型
		fileTypeDesc: '图片',
		
		onUploadSuccess: function(file, data, response){
			var data2 = JSON.parse(data);
			if(data2.s){
				$("#"+imgListId).zImgslider_addImg(basePath,data2.d.savePath,maxCount);
			}else{
				alert(data2.d);
			}
		}
	});
}

// 初始化文件上传功能
//	用法：
//		z_initFlieUpload("upload2", "${contextPath}", "Downloads-zt", "linkUrl");
//		z_initFlieUpload("upload2", "${contextPath}", "Downloads-zt", "linkUrl", "上传文件");
//	后台默认接收地址：
//		${contextPath}/file/upload.ajax
//	上传完之后：
//		显示地址URL到表单input控件中
// 	依赖：
//		<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
//		<script type="text/javascript" src="${contextPath}/ext/json/json2.js"></script>
//		<link rel="stylesheet" type="text/css" href="${contextPath}/admin/ext/uploadify/uploadify.css" media="screen" />
//		<script type="text/javascript" src="${contextPath}/admin/ext/uploadify/jquery.uploadify.min.js?t=<@z.z_now />"></script>
function z_initFlieUpload(uploadButtonId, basePath, saveCatalog, resultPathInputId, buttonText) {
	
	var btext = "上传文件";
	if (buttonText) {
		btext = buttonText;
	}
	
	$('#'+uploadButtonId).uploadify({
		
		uploader: basePath+'/file/upload.ajax',
		formData: { type: saveCatalog },
		swf: basePath+'/admin/ext/uploadify/uploadify.swf',
		
		buttonText: btext,
		buttonClass: 'btn btn-primary no-padding',
		removeTimeout: 0.1,
		width : 70,
		height : 30,
		
		multi: false,
		fileSizeLimit: '100MB',// 文件大小限制
		// fileTypeExts: '*.gif;*.jpg;*.png;*.bmp;*.jpeg',// 默认为所有类型
		fileTypeDesc: '文件',
		
		onUploadSuccess: function(file, data, response){
			var data2 = JSON.parse(data);
			if(data2.s){
				$("#"+resultPathInputId).val(basePath+data2.d.savePath);
			}else{
				alert(data2.d);
			}
		}
	});
}

// 初始化文件上传功能（FastDFS方式上传）
//	用法：
//		z_initFlieUpload_fastdfs("upload2", "${contextPath}", "zt", "linkUrl");
//		z_initFlieUpload_fastdfs("upload2", "${contextPath}", "zt", "linkUrl", "上传文件");
//	后台默认接收地址：
//		${contextPath}/file/fupload.ajax
//	上传完之后：
//		显示地址URL到表单input控件中
// 	依赖：
//		<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
//		<script type="text/javascript" src="${contextPath}/ext/json/json2.js"></script>
//		<link rel="stylesheet" type="text/css" href="${contextPath}/admin/ext/uploadify/uploadify.css" media="screen" />
//		<script type="text/javascript" src="${contextPath}/admin/ext/uploadify/jquery.uploadify.min.js?t=<@z.z_now />"></script>
function z_initFlieUpload_fastdfs(uploadButtonId, basePath, saveCatalog, resultPathInputId, buttonText) {
	var btext = "上传文件";
	if (buttonText) {
		btext = buttonText;
	}
	$('#'+uploadButtonId).uploadify({
		uploader: basePath+'/file/fupload.ajax',
		formData: { type: saveCatalog },
		swf: basePath+'/admin/ext/uploadify/uploadify.swf',
		buttonText: btext,
		buttonClass: 'btn btn-primary no-padding',
		removeTimeout: 0.1,
		width : 70,
		height : 30,
		multi: false,
		fileSizeLimit: '100MB',// 文件大小限制
		// fileTypeExts: '*.gif;*.jpg;*.png;*.bmp;*.jpeg',// 默认为所有类型
		fileTypeDesc: '文件',
		onUploadSuccess: function(file, data, response){
			var data2 = JSON.parse(data);
			if(data2.s){
				$("#"+resultPathInputId).val(data2.d.savePath);
			}else{
				alert(data2.d);
			}
		}
	});
}

// 弹出成功提示
function z_alert_success(value) {
	alert(value);
}

// 弹出错误提示
function z_alert_error(value) {
	alert(value);
}

// 弹出layer提示
function z_alert_layer(value) {
	layer.alert(value, 8);
}

// 弹出窗口
// 依赖插件：layer
function z_openIframe(title, width, height, src) {
	//如果没有附加参数
	if (src.indexOf('?') == -1) {
		src += '?n=' + Math.random();
	} else {
		src += '&n=' + Math.random();
	}
	
	$.layer({
		type: 2,// 0：信息框（默认），1：页面层，2：iframe层，3：加载层，4：tips层。
		maxmin: true,// 是否输出窗口最小化/全屏/还原按钮。 
		shadeClose: false,// 用来控制点击遮罩区域是否关闭层。
		title: title,
		area: [width+'px', height+'px'],
		iframe: {
			src: src
		}
	});
}

// 调用后台 AJAX 操作，完成后：刷新列表grid、关闭所有弹窗layer、并弹出操作结果。
// 依赖插件：layer、grid
function z_ajaxoper(url, oper) {
	layer.confirm('确认'+oper+'？', function() {
		$.post(url, function(data){
			if(data.s!=1){
				z_alert_layer(data.d||"操作失败！");
	        } else {
	        	grid.refresh();
				layer.closeAll();
				z_alert_success(data.d||"操作成功！");
	        }
		}, "json");
	});
}

// 删除。完成后自动调用 grid.refresh()
// 依赖插件：layer、grid、tool
// dataString格式：[1,2,3]
function z_delete2(dataString, url) {
	z_oper2(dataString, url, "删除");
}

// 操作。完成后自动调用 grid.refresh()
// 依赖插件：layer、grid、tool
// dataString格式：[1,2,3]
function z_oper2(dataString, url, oper) {
	if (!dataString || dataString.length == 0) {
		z_alert_layer('请选择至少一条记录！');
		return false;
	}
	var ids = "";
	for (i in dataString) {
		ids += dataString[i];
		if (i < dataString.length-1) {
			ids += ",";
		}
	}
	layer.confirm('确认'+oper+'？', function() {
		$.post(url, {"ids":ids}, function(data){
			if(data.s!=1){
				z_alert_layer(data.d||"操作失败！");
	        } else {
	        	grid.refresh();
				layer.closeAll();
				z_alert_success(data.d||"操作成功！");
	        }
		}, "json");
	});
}

// 导出
function z_export(url) {
	$.ajax({url:url,data:{},type:"post",dataType:"json", success: function(data){
        if(data.s!=1){
        	z_alert_error(data.d);
        	return;
        }
        var url = _z_basepath+"/file/download.ajax?path="+encodeURI(data.d.url)+"&fileName="+encodeURI(data.d.fileName);
        window.location.href=url;
	}});
}






/** 
 * @deprecated
 * 有url长度限制，由z_oper2()方法代替。
  */
function z_oper(dataString, url, oper) {
	if (dataString.length == 0) {
		z_alert_layer('请选择至少一条记录！');
		return false;
	}
	var theUrl = "";
	if (url.indexOf("?") > 0) {
		theUrl = url + '&' + dataString;
	} else {
		theUrl = url + '?' + dataString;
	}
	layer.confirm('确认'+oper+'？', function() {
		$.post(theUrl, function(data){
			if(data.s!=1){
				z_alert_layer(data.d||"操作失败！");
	        } else {
	        	grid.refresh();
				layer.closeAll();
				z_alert_success(data.d||"操作成功！");
	        }
		}, "json");
	});
}

/** 
 * @deprecated
 * 有url长度限制，由z_delete()方法代替。
  */
function z_delete(dataString, url) {
	z_oper(dataString, url, "删除");
}