<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" type="text/css" href="${contextPath}/ext/jquery_mobile/jquery.mobile.icons-1.4.5.min.css" media="screen" />
<link rel="stylesheet" type="text/css" href="${contextPath}/ext/jquery_mobile/theme-classic.css" media="screen" />
<link rel="stylesheet" type="text/css" href="${contextPath}/ext/jquery_mobile/jquery.mobile.structure-1.4.5.min.css" media="screen" />
<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
<script>
$(document).bind("mobileinit", function() {
	$.mobile.ajaxEnabled=false;
});
</script>
<script type="text/javascript" src="${contextPath}/ext/jquery_mobile/jquery.mobile-1.4.5.min.js"></script>
<script type="text/javascript" src="${contextPath}/ext/jquery_tmpl/jquery.tmpl.js"></script>
<script type="text/javascript">
var p = 2;// 第一次点击更多时取第二页
function _more() {
	$("#button_more").hide();
	$.post("${contextPath}/mobile/listajax.ajax?id=${(obj.id)!}", { "p": p }, function(data){
		if(data.s!=1){
			alert(data.d);
			return;
        }
        $("#articleTemplate").tmpl(data.d).appendTo("#listview_articles");
		$("#listview_articles").listview("refresh");
		p = p + 1;
		$("#button_more").show();
	}, "json");
}
</script>
</head>
<body>
	<div data-role="page" data-title="瓯海教育网" data-theme="c">
		<div data-role="header" data-theme="b">
			<a data-role="button" data-icon="back" data-iconpos="notext" data-rel="back">返回</a>
			<h1>${(obj.name)!}</h1>
		</div>
		<div data-role="content">
			<ul id="listview_articles" data-role="listview">
				<#list rows as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${art.id}">
						${(art.title)!}
						<p>[${((art.showtime)?string("yyyy-MM-dd"))!}]</p>
				</a></li>
				</#list>
			</ul>
			<br/>
			<a id="button_more" href="javascript: _more();" data-role="button">更多</a>
		</div>
		<div data-role="footer" data-theme="b">
			<h4>主办单位：温州市瓯海区教育局</br>承办单位：温州市瓯海区教师发展中心</br>瓯海教育信息中心</br>浙ICP备05082032号</br><a data-role="button" target="_blank" href="${contextPath}/index.html?type=no">电脑版</a></h4>
		</div>
	</div>
	<script id="articleTemplate" type="text/x-jquery-tmpl">
		<li><a href="${contextPath}/mobile/detail.do?id={{= id}}">
				<h3>{{= title}}</h3>
				<p>[{{= showtime.substring(0,10)}}]</p>
		</a></li>
	</script>
</body>
</html>