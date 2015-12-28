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
<script>
	function _lists(id) {
		window.location.href = "${contextPath}/mobile/lists.do?id=" + id;
	}
	function _list(id) {
		window.location.href = "${contextPath}/mobile/list.do?id=" + id;
	}
	function _search() {
		var key = $("#index_input_search").val();
		if (key && key.length > 0) {
			window.location.href = "${contextPath}/mobile/search.do?searchValue=" + key;
		} else {
			return false;
		}
	}
</script>
</head>
<body>
	<div data-role="page" data-title="瓯海教育网" data-theme="c">
		<div data-role="header" data-theme="b">
			<h1><img alt="" src="${contextPath}/www/images/mobile_index_logo.png" height="40px"></h1>
			<a href="${contextPath}/mobile/menu.do" data-role="button" data-icon="grid" data-iconpos="notext" class="ui-btn-right"  data-transition="flip">栏目</a>
		</div>
		<div data-role="content">
			<form id="searchForm" method="post" onsubmit="return _search();">
				<input id="index_input_search" data-type="search" placeholder="请输入搜索条件">
			</form>
			<br/>
			<ul data-role="listview">
			
				<#-- <li data-role="list-divider" data-theme="b">本站公告<span class="ui-li-count" onclick="_list(253);">更多</span></li>
				<#list articleMap["253"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list> -->
				
				<li data-role="list-divider" data-theme="b">教育动态<span class="ui-li-count" onclick="_lists(7);">更多</span></li>
				<#list articleMap["7"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
				<li data-role="list-divider" data-theme="b">公文发布<span class="ui-li-count" onclick="_lists(8);">更多</span></li>
				<#list articleMap["8"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
				<li data-role="list-divider" data-theme="b">教研师资<span class="ui-li-count" onclick="_lists(13);">更多</span></li>
				<#list articleMap["13"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
				<li data-role="list-divider" data-theme="b">教育信息化<span class="ui-li-count" onclick="_lists(10);">更多</span></li>
				<#list articleMap["10"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
				<li data-role="list-divider" data-theme="b">教育督导<span class="ui-li-count" onclick="_lists(20);">更多</span></li>
				<#list articleMap["20"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
				<li data-role="list-divider" data-theme="b">瓯海民办教育<span class="ui-li-count" onclick="_lists(21);">更多</span></li>
				<#list articleMap["21"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
				<li data-role="list-divider" data-theme="b">招生考试<span class="ui-li-count" onclick="_lists(11);">更多</span></li>
				<#list articleMap["11"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
				<li data-role="list-divider" data-theme="b">教育装备<span class="ui-li-count" onclick="_lists(14);">更多</span></li>
				<#list articleMap["14"] as art>
				<li><a href="${contextPath}/mobile/detail.do?id=${(art.id)!}">
						${(art.title)!}
				</a></li>
				</#list>
				
			</ul>
		</div>
		<div data-role="footer" data-theme="b">
			<h4>主办单位：温州市瓯海区教育局</br>承办单位：温州市瓯海区教师发展中心</br>瓯海教育信息中心</br>浙ICP备05082032号</br><a data-role="button" target="_blank" href="${contextPath}/index.html?type=no">电脑版</a></h4>
		</div>
	</div>
</body>
</html>