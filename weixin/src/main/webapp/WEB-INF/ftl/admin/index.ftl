<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>后台管理系统</title>
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" />
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/index.css?v=${sversion}" />
</head>
<body>
	<!-- changes 需要使用JS来动态调整以正常显示下拉列表，由内容区取得获得正常高度，切换折叠模式时动态更改高度 -->
	<!-- changes 增加 属性allowTransparency="true" 修正IE下iframe背景为白色非透明问题 -->
	<iframe class="top" height="36" src="${contextPath}/index/top.do" frameborder="0" name="topFrame" id="topFrame" allowTransparency="true"></iframe>
	
	<!-- 有top页加class top-iframe-margin -->
	<div id="container" class="container">
		<iframe class="container-iframe" id="container-iframe" name="contentFrame" src="${contextPath}/index/container.do" scrolling="yes" noresize="noresize" frameborder="0"></iframe>
	</div>

    <!-- 顶部折叠按钮 不需要请删除 -->
    <a class="top-collapse" id="top-collapse" href="javascript:void(0);" title="折叠"></a>
    <script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/javascripts/tool.js?v=${sversion}"></script>
    <script type="text/javascript" src="${contextPath}/admin/javascripts/jquery-zwbam.js"></script>
    <script>
		
		//根据链接参数配置窗口显示模式
		var paramobj = $.fn.zwbam('getUrlParams');
		//减少创建图标按钮时的视觉显示冲突
		if (paramobj.mode && paramobj.mode === "mini") {
			$('#container').addClass("mini-iframe-margin")
			$('.top').height(36);
		} else {
			$('#container').addClass("top-iframe-margin")
			$('.top').height(88);
		}
		$(function () {
			//顶部折叠按钮
			$('#top-collapse').click(function () {
				window.frames['topFrame'].Header.switchingMode();
			});
	
		})
	</script>
</body>
</html>