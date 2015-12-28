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
<script type="text/javascript">
jQuery(function(){
	jQuery(window).load(function(){
		var maxWidth = $(window).width() - 20;
		$(".zdetail_img img").each(function(i){
			$(this).parents("p").css({"text-indent": "0"});
			if (this.width > maxWidth) {			
				$(this).css({"width": "100%", "height": "auto", "display": "block"});
			}
		});
	});
});
</script>
</head>
<body>
	<div data-role="page" id="detail_jq_page" data-title="瓯海教育网 - ${(obj.title)!}" data-theme="c">
		<div data-role="header" data-theme="b">
			<a data-role="button" data-icon="back" data-iconpos="notext" data-rel="back">返回</a>
			<h1>瓯海教育网</h1>
		</div>
		<div data-role="content">
			<div class="ui-body ui-body-c ui-corner-all">
				<h3 align="center">${(obj.title)!}</h3>
				<p style="color: #666666">${((obj.showtime)?string("yyyy-MM-dd"))!} ${(obj.userName)!}</p>
				<font size="4" class="zdetail_img">
				${(obj.context)!}
				<!-- JiaThis Button BEGIN -->
				<div class="jiathis_style_32x32">
					<a class="jiathis_button_qzone"></a>
					<a class="jiathis_button_tsina"></a>
					<a class="jiathis_button_tqq"></a>
					<a class="jiathis_button_weixin"></a>
					<a href="http://www.jiathis.com/share" class="jiathis jiathis_txt jtico jtico_jiathis" target="_blank"></a>
					<a class="jiathis_counter_style"></a>
				</div>
				<script type="text/javascript" src="http://v3.jiathis.com/code/jia.js" charset="utf-8"></script>
				<!-- JiaThis Button END -->
				</font>
			</div>
		</div>
		<div data-role="footer" data-theme="b">
			<h4>主办单位：温州市瓯海区教育局</br>承办单位：温州市瓯海区教师发展中心</br>瓯海教育信息中心</br>浙ICP备05082032号</br><a data-role="button" target="_blank" href="${contextPath}/index.html?type=no">电脑版</a></h4>
		</div>
	</div>

</body>
</html>
